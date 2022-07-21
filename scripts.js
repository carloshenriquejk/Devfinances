const Modal = {
    open(){
        //a função vai adicionar a lista de classe do  model.overlay 
        // pela função document
        document
        .querySelector('.modal-overlay')
        .classList
        .add('active')
    },
    close(){
        document
        .querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
    
}
const Storage = {
    //pegar
    get(){
        //transforma de string parra array
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    //guarddar ou comfiguar
    set(transactions){
        // o  JSON.stringify transforma a string em um objeto

        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}
const Transaction = {
    //vai pegar todos as transaçóes
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index){
        // o splice va pegar a posição do array
        Transaction.all.splice(index, 1)
        //remove da tela
        App.reload()
    },
    incomes(){
        let income = 0;
        //pegar todas transações
       //para cada transação/ arrow function com um elemento
       Transaction.all.forEach(transaction => {
            //se ela for maior que zero
            if( transaction.amount > 0 ) {

            income += transaction.amount;
            }
        })
        return income;
    },
    expenses(){
        let expense = 0;
        //pegar todas transações
       //para cada transação/ arrow function com um elemento
       Transaction.all.forEach(transaction => {
            //se ela for maior que zero
            if( transaction.amount < 0 ) {

            expense += transaction.amount;
            }
        })
         return expense;
    },
    total(){

        return Transaction.incomes() + Transaction.expenses();

    },
}
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index){

   
        // a função cria um tr dentro do innerHTMLTransaction
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTansaction(transaction, index)
        //index é a posição do array
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTansaction(transaction, index) {
        const Cssclass = transaction.amount > 0 ? "income" : "expense"
        
        const amount = Utils.formatCurrency(transaction.amount)
    const html = `
    
    <td class="descripton">${transaction.description}</td>
    <td class="${Cssclass}"> ${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
    <img onclick="Transaction.remove(${index})" src="./assets/assets/minus.svg" alt="remover transação">
    </td>
    

    `
    return html;
},
updateBalance(){
    document
    .getElementById('incomeDisplay')
    // o Utils.formatcurrency é uma função q ta chamando outra funçãr tansaction
    .innerHTML = Utils.formatCurrency(Transaction.incomes())

    document
    .getElementById('expenseDisplay')
    .innerHTML = Utils.formatCurrency(Transaction.expenses())

    document
    .getElementById('totalDisplay')
    .innerHTML =  Utils.formatCurrency(Transaction.total())
},
clearTransaction(){
    DOM.transactionsContainer.innerHTML = ""
}
}
const Utils = {
    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100

        return value
    },

    formatDate(date){
        //mudar as cofigurações da data
        //split recebe os dados sem o - tuodo que esta dento das aspas 
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

     formatCurrency(value){
         // o number vai tansformar a string em numero everifica se valor e menor q zero 
         //se for o sinal vai ser de menos se não vai ser positivo
         const signal = Number(value) < 0 ? "-" : ""

     // /\D/g é ache tudo q não é numero ou caracter diferente, o g pocua no codigo todo

    value = String(value).replace(/\D/g,"")

     value = Number(value) / 100
     
     //transforma o valor em moeda brasileia
     value = value.toLocaleString("pt-BR", {
         style: "currency",
         currency: "BRL"
     })
     return signal + value
     } 
}

const Form = {
    // conexão entre o js e o html/está pegando o elemento inteiro do input
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),


    getValues(){
        //está pegando os valores
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    //verificar se todas as iformações foram preenchidas
    validateFields() {
        const { description, amount, date } = Form.getValues()

        if( description.trim() === " " || 
            amount.trim() === " " || 
            date.trim() === " " ) {
           //throw é jogar pra fora
           //new Erro ta criando um erro
           throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return{
            //é possivel receber os valores assim se for na mesma constante
            description,
            amount,
            date
        }
    },
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){

       //vai interomper o comportamento de ir por link
       event.preventDefault()
       //vai capturar o erro
       try {
        Form.validateFields()
        const transaction = Form.formatValues()
        Transaction.add(transaction)
       Form.clearFields()
       Modal.close()
    } catch (error) {
        alert(error.message)
    }
}

}
//alocar as informações no navegados


const App = {
    init(){

    //para cada elemento vai ser execultado uma função
    //Transaction.all.forEach((transaction, index) => {
        //vai adiciona uma transação
    //DOM.addTransaction(transaction, index)
    Transaction.all.forEach(DOM.addTransaction)

    DOM.updateBalance()

    Storage.set(Transaction.all)

    },
    reload(){
        DOM.clearTransaction()
        App.init()
    },
}
App.init()

