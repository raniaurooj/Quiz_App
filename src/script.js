const category_dropdown = document.querySelector(".category_dropdown select");
const start_btn = document.querySelector("#start_btn");
const selectContainer = document.querySelector(".Container");

const quizContainer = document.querySelector(".quiz-container");
const optionsContainer = document.querySelector(".options");
const question  = document.querySelector(".question");
const submitBtn = document.querySelector("#submit-btn");
const nextBtn = document.querySelector("#next-btn");
const msg = document.querySelector(".quiz-container .msg");

const resultContainer = document.querySelector(".result-container");
const resultScore = document.querySelector(".result");
const resetbtn = document.querySelector("#reset-btn");

let indx = 0;
let score = 0;
let results = [];

//To create a dropdown of categories
for(let category in categoryIdsList){
    let newOption = document.createElement("option");
    newOption.innerText = category;
    newOption.value = category;
    if(category === "General Knowledge"){
        newOption.selected = "selected";
    }
    category_dropdown.append(newOption);
}

//function to suffle array 
const shuffleAnswers = (options)=>{
    //Fisher-Yates shuffle
    for(let i=options.length-1; i>0; i--){

        const j = Math.floor(Math.random() * (i+1));
        //destruncting assignment used to swap values at i and j indexes
        [options[i],options[j]] = [options[j],options[i]];

    }
}

//sunction showing result
const showResult = (results)=>{
   quizContainer.classList.add("hidden");
   resultContainer.classList.remove("hidden");
   resultScore.innerText = `${score} / ${results.length}`;
}

//resetBtn click handling
resetbtn.addEventListener("click",()=>{
   resultContainer.classList.add("hidden");
   selectContainer.classList.remove("hidden");
})

//function to display questions 
const showQuestion = (results,indx)=>{

    optionsContainer.innerHTML = "";
    const ques = results[indx].question;
    const correct_answer = results[indx].correct_answer;
    const incorrect_answers = results[indx].incorrect_answers;
    const options = [...incorrect_answers,correct_answer];

    shuffleAnswers(options);
    question.innerHTML = ques;

    for(let option of options){
        const label = document.createElement("label");
        label.innerHTML = `<input type="radio" name="option" value="${option}"> ${option}`;
        label.style.display = "block";
        optionsContainer.append(label);
    }
}

const startQuiz =  async(category,difficulty,type,amount)=>{
    const URL = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;
    let response = await fetch(URL);
    let data = await response.json();
    results = [];
    results = data.results;
    score = 0;
    indx = 0;
    showQuestion(results,indx);

}

submitBtn.addEventListener("click",()=>{
      msg.innerText = "";
      const selectedOption = document.querySelector(".options input:checked");
      if(!selectedOption){
       msg.innerText  = "Please select an option before submitting.";
       msg.style.color = "#CB0404";
       return;
      }
      
    submitBtn.disabled = true;
    nextBtn.disabled = false;
    if(selectedOption.value == results[indx].correct_answer){
        msg.innerText = "Correct Answer";
        msg.style.color = "#16610E";
        score++;
    }
    else{
        msg.innerHTML = `Wrong Answer: Correct Answer is ${results[indx].correct_answer}`;
        msg.style.color = "#CB0404";
     }

})

nextBtn.addEventListener("click", () => {
    submitBtn.disabled = false;
    nextBtn.disabled = true;
    msg.innerText = "";
    indx++;
    if (indx < results.length) {
        showQuestion(results, indx);
    } else {
        showResult(results);
    }
});

start_btn.addEventListener("click",(evt)=>{
    evt.preventDefault();
    const categoryName = category_dropdown.value;
    const category = categoryIdsList[categoryName];
    const difficulty = document.querySelector(".difficulty_dropdown select").value;
    const type = document.querySelector(".select_type select").value;
    const amount = document.querySelector(".number input").value;

    selectContainer.classList.add("hidden");
    quizContainer.classList.remove("hidden");

    startQuiz(category,difficulty,type,amount);
    
})




