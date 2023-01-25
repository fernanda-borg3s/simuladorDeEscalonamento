
let tabela = document.getElementById("tabela");
tabela.style.display = "none"

function carregarNovoProcesso(){
    location.reload();

    // //limpa processos na fila
    // let lista = document.getElementsByClassName("list");
    // for(let j = lista.length -1; j >=0; j--){
    //     lista[j].remove();
    // }

    // //adiciona os novos processos
    // let qtdDeProcessos = Number(prompt("Quantos processos deseja carregar?"));
    // armazenaProcesso = new Array(qtdDeProcessos);
    // tratarProcesso();
}
document.getElementById('carrega-fila').addEventListener('click', carregarNovoProcesso)
let sjf = document.getElementById('radio-sjf');

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

//funçao do processo FIFO
function Fila(){
    this.lista = new Array();
 
    this.Inserir = function(obj){
        this.lista[this.lista.length] = obj;
        // console.log("funçao inserir: " + this.lista)
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
 
    // this.LerPrimeiro = function(){
    //     if(this.lista.length > 0){
    //         return this.lista[0];
    //     }else{
    //         alert("Não há objetos na fila.")
    //     }
    // }
}

function executar(){
    let tabelaLinha = document.getElementById("tabela-head");
    let fifo = document.getElementById('radio-fifo');

    if(fifo.checked == true){
        function processoFila(){
            //for para trata elementos na fila
            for(let a = 0; a < armazenaProcesso.length; a++){
                let char = (a+1);
                    // console.log(String.fromCharCode(char+64))
                    document.getElementById("cpu").value = String.fromCharCode(char+64);
                let pilha = new Fila();
                pilha.Inserir(armazenaProcesso[a]);
                var item = pilha.RemoverPrimeiro();
                    alert(item);
                    // console.log(pilha)
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
                document.getElementById("tempoTurnaround").innerHTML = timeTurnAround;
                //calculo logico do tempo de espera;
                timeTurnAround = timeTurnAround - armazenaProcesso[k];
                document.getElementById("TempoEspera").innerHTML = timeTurnAround;
            }
        }
      processoFila();
        
    }else if(sjf.checked == true){
            armazenaProcesso.sort(function(a,b){
            if(a > b) return 1;
            if(a < b) return -1;
            return 0;
           });  
        for(let b = 0; b < armazenaProcesso.length; b++){
            // let char = (b+1);
            // document.getElementById("cpu").value = String.fromCharCode(char+64);
                let chamaSjf = new Fila();
                chamaSjf.Inserir(armazenaProcesso[b])
            var item = chamaSjf.RemoverPrimeiroMenor();
                alert(item);
                tabela.style.display = "block";

                tabelaLinha.insertAdjacentHTML('afterend', '<tr><td id="processo"></td> <td id="tempoTurnaround"></td> <td id="TempoEspera"></td></tr>');
                // let char = (b+1);
                document.getElementById("processo").innerHTML = (b+1) +"º - "+armazenaProcesso[b];
                //calculo logico do tempo de turnAround
                let timeTurnAround =+ armazenaProcesso[b] 
                for(let conta = 0; conta < b; conta++){
                    timeTurnAround = timeTurnAround + armazenaProcesso[conta];
                }
                document.getElementById("tempoTurnaround").innerHTML = timeTurnAround;
                //calculo logico do tempo de espera;
                timeTurnAround = timeTurnAround - armazenaProcesso[b];
                document.getElementById("TempoEspera").innerHTML = timeTurnAround;
                // console.log(pilha)
        }
        
    }else{
        alert("OH NÃO! ALGO DEU ERRADO! \n Por favor, confira se os campos foram marcados devidamente")
    }

}
document.getElementById("executa").addEventListener('click', executar)
