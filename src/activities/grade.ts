export function gradeQuiz(answers:number[],correct:number[]){
 if(answers.length!==10||correct.length!==10||answers.some(a=>!Number.isInteger(a)||a<0||a>3))throw Error('Bài kiểm tra chưa đủ 10 câu');
 const score=answers.filter((a,i)=>a===correct[i]).length;
 return {answers:[...answers],score,passed:score>=7&&answers[6]===correct[6]};
}
