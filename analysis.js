const original = "fred"
let word = original
if (word.length == 0){
    word = String.fromCharCode(97 + Math.floor(Math.random()*26))
}
while (word[word.length-1] != "{"){
    let score = Array(27).fill(0)
    for (let i = 0; i < word.length+1; i++){
        if (Object.keys(data).includes(word.substr(i))){
            Object.keys(data[word.substr(i)]).forEach(x => score[x.charCodeAt(0)-97] += data[word.substr(i)][x])
            let choice = Math.floor(score.reduce((a,v) => a+Math.pow(v,2),0)*Math.random());
            word += score.reduce((a,v,i) => isNaN(a) ? a : a+Math.pow(v,2)>= choice  ? String.fromCharCode(i+97) : a+Math.pow(v,2),0)
            break
        }
    }
    if (word.length < 5 &&  word[word.length-1] == "{"){
        word = word.substr(0,word.length-1)
    }
    if (word.length > 25 + original.length){
        word = original || String.fromCharCode(97 + Math.floor(Math.random()*26))
    }
}
console.log(word.substr(0,word.length-1) )