//Expérience et formation
let tabFormaElement=[];
let tabFormaClassName=[];
let tabFormaTextElement=[];
let activeText;
let NbDetailles= 10
for(let i = 0; i<=NbDetailles; i++)
{
    tabFormaElement[i]= document.getElementById("Vp"+ i);
    tabFormaClassName[i]= "#Vp"+i;
    tabFormaTextElement[i]= "#DetSec"+i;
}

for(let i = 0; i<=tabFormaElement.length; i++)
{
    tabFormaElement[i].addEventListener("click",mySkils);

    function mySkils() {
        var elem = $(""+tabFormaClassName[i]).text();
        if (elem == "+") {
          //Stuff to do when btn is in the Skils + state
          $(""+tabFormaClassName[i]).text("-");
          $(""+tabFormaTextElement[i]).slideDown();
          if (activeText != i){
            $(""+tabFormaTextElement[activeText]).slideUp();
            $(""+tabFormaClassName[activeText]).text("+");
          }
          activeText = i
        } else {
          //Stuff to do when btn is in the Skils - state
          $(""+tabFormaClassName[i]).text("+");
          $(""+tabFormaTextElement[i]).slideUp();
        }
      }
}