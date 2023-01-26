
let tabela = document.getElementById("tabela");
tabela.style.display = "none";

function carregarNovoProcesso(){
    location.reload();
}

document.getElementById('carrega-fila').addEventListener('click', carregarNovoProcesso)
let sjf = document.getElementById('radio-sjf');//esta aqui por usso em varia funçoes;
//funçao recebe valores e adiciona na fila
function tratarProcesso(){
//organiza na fila de prontos
 for(let i = 0; i < armazenaProcesso.length; i++){
    let qtdDeCadaProcesso = Number(prompt("Insira a quantidade de processos do item "+(i+1)));
    armazenaProcesso[i] = qtdDeCadaProcesso;
        //criar elementos da fila
        let criarItem = document.createElement("li");
        criarItem.classList.add('list');
        criarItem.textContent = armazenaProcesso[i];
        document.getElementById('campo-fila').appendChild(criarItem);
 }
}
let armazenaProcesso;
//função assim que a pagina carrega, para não ter repetição
function carregarProcessoInicial(){
    tabela.style.display = "none";
    let qtdDeProcessos = Number(prompt("Quantos processos deseja carregar?"));
    armazenaProcesso = new Array(qtdDeProcessos);
    tratarProcesso();
}
// carregarProcessoInicial();

//funçao do processo FIFO e SJF
function Fila(){
    this.lista = new Array();
 
    this.Inserir = function(obj){
        this.lista[this.lista.length] = obj;
    }
    this.RemoverPrimeiro = function(){
        if(this.lista.length > 0){
            var obj = this.lista[0];
            this.lista.splice(0,1);
            return obj;    
        }else{
            alert("Não há objetos na fila.")
        }
    }
    this.RemoverPrimeiroMenor = function(){
        if(this.lista.length > 0){
            var obj = this.lista[0];
            this.lista.sort();
        console.log("funçao inserir: " + obj)
            return obj;    
        }else{
            alert("Não há objetos na fila.")
        }
    }
}

function executar(){
    let tabelaLinha = document.getElementById("tabela-head");
    let fifo = document.getElementById('radio-fifo');
    let roundRobin = document.getElementById("round-Robin");
    let txtMediaTurnAround = document.getElementById("media");
    let valorQuantum = parseInt(document.getElementById("valor-quantum").value);
    let mediaTurnAround = 0;


    if(fifo.checked == true){
        function processoFila(){
            //for para trata elementos na fila
            for(let a = 0; a < armazenaProcesso.length; a++){
                let char = (a+1);
                document.getElementById("cpu").value = String.fromCharCode(char+64);
                    let pilha = new Fila();
                    pilha.Inserir(armazenaProcesso[a]);
                    var item = pilha.RemoverPrimeiro();
                    alert("Ordem no CPU: " + item);

            }
            // for para inserir elementos da fila em uma tabela com TurnAround e Tempo de espera
            tabela.style.display = "block";
            for(let k = 0; k < armazenaProcesso.length; k++){
                    //cria as linhas da tabela dinamicamente
                tabelaLinha.insertAdjacentHTML('afterend', '<tr><td id="processo"></td> <td id="tempoTurnaround"></td> <td id="TempoEspera"></td></tr>');
                //converte o numero do indice do array em letra do alfabeto e adiciona a tabela
                let char = (k+1);
                document.getElementById("processo").innerHTML = String.fromCharCode(char+64);
                //calculo logico do tempo de turnAround
                let timeTurnAround =+ armazenaProcesso[k] 
                for(let conta = 0; conta < k; conta++){
                    timeTurnAround = timeTurnAround + armazenaProcesso[conta];

                }
                mediaTurnAround = (mediaTurnAround + timeTurnAround) / armazenaProcesso.length;

                document.getElementById("tempoTurnaround").innerHTML = timeTurnAround;
                //calculo logico do tempo de espera;
                timeTurnAround = timeTurnAround - armazenaProcesso[k];
                document.getElementById("TempoEspera").innerHTML = timeTurnAround;
            }
           txtMediaTurnAround.innerHTML = `O tempo médio de TurnAround é = ${mediaTurnAround.toFixed(2)}`

        }
      processoFila();
    }else if(sjf.checked == true){
            armazenaProcesso.sort(function(a,b){
            if(a > b) return 1;
            if(a < b) return -1;
            return 0;
           });  
        for(let b = 0; b < armazenaProcesso.length; b++){
                let chamaSjf = new Fila();
                chamaSjf.Inserir(armazenaProcesso[b])
            var item = chamaSjf.RemoverPrimeiroMenor();
                alert("Ordem no CPU: " + item);
                tabela.style.display = "block";
                tabelaLinha.insertAdjacentHTML('afterend', '<tr><td id="processo"></td> <td id="tempoTurnaround"></td> <td id="TempoEspera"></td></tr>');
                document.getElementById("processo").innerHTML = (b+1) +"º - "+armazenaProcesso[b];
                //calculo logico do tempo de turnAround
                let timeTurnAround =+ armazenaProcesso[b] 
                for(let conta = 0; conta < b; conta++){
                    timeTurnAround = timeTurnAround + armazenaProcesso[conta];
                }
                mediaTurnAround = (mediaTurnAround + timeTurnAround) / armazenaProcesso.length;
                
                document.getElementById("tempoTurnaround").innerHTML = timeTurnAround;
                //calculo logico do tempo de espera;
                timeTurnAround = timeTurnAround - armazenaProcesso[b];
                document.getElementById("TempoEspera").innerHTML = timeTurnAround;
        }
        txtMediaTurnAround.innerHTML = `O tempo médio de TurnAround é = ${mediaTurnAround.toFixed(2)}`

    }else if(roundRobin.checked == true){
          // funçao para achar o tempo de espera de todo o processo
        const findWaitingTime = (n, bt, wt, quantum) => {
            let rem_bt = new Array(n).fill(0);
            for (let i = 0; i < n; i++)
                rem_bt[i] = bt[i];
            let t = 0; 
            while (1) {
                let done = true;
                for (let i = 0; i < n; i++) {
                    if (rem_bt[i] > 0) {
                        done = false;
                        if (rem_bt[i] > quantum) {
                            t += quantum;
                            rem_bt[i] -= quantum;
                        }
                        else {
                            t = t + rem_bt[i];
                            wt[i] = t - bt[i];
                            rem_bt[i] = 0;
                        }
                    }
                }
                if (done == true)
                    break;
            }
        }
        // função pra calcular turnAround
        const findTurnAroundTime = (n, bt, wt, tat) => {
            for (let i = 0; i < n; i++)
                tat[i] = bt[i] + wt[i];
        }  
        // Funçao tempo de espera
        const findavgTime = ( n, bt, quantum) => {
            let wt = new Array(n).fill(0), tat = new Array(n).fill(0);
            let total_wt = 0, total_tat = 0;
            //chama funçoes
            findWaitingTime( n, bt, wt, quantum);
            findTurnAroundTime(n, bt, wt, tat);
            // Calcula total de tempo de espera e turnAround
            for (let i = 0; i < n; i++) {
                total_wt = total_wt + wt[i];
                total_tat = total_tat + tat[i];
            tabela.style.display = "block";

                tabelaLinha.insertAdjacentHTML('afterend', '<tr><td id="processo"></td> <td id="tempoTurnaround"></td> <td id="TempoEspera"></td></tr>');
                document.getElementById("processo").innerHTML = `${bt[i]}`
                document.getElementById("tempoTurnaround").innerHTML = `${tat[i]}`;
                document.getElementById("TempoEspera").innerHTML = `${wt[i]}`;
                // console.log(`${bt[i]} ${tat[i]} ${wt[i]} <br/>`);
            }
            txtMediaTurnAround.innerHTML = `Tempo médio de TurnAround = ${(total_tat / n).toFixed(2)}`;
        }
        let n = armazenaProcesso.length;
        let processo = armazenaProcesso
        let quantum = valorQuantum;
        findavgTime( n, processo, quantum);
    }else{
        alert("OH NÃO! ALGO DEU ERRADO! \n Por favor, confira se os campos foram marcados devidamente")
    }

}
document.getElementById("executa").addEventListener('click', executar)
