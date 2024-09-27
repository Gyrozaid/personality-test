

export class Test {
    constructor() {
       this.questions = [];
       this.qList = {};
       this.reset();
    }

    reset() {
        const personalityQuestions = {
            "E1p": "I am the life of the party.",
            "E2n": "I don't talk a lot.",
            "E3p": "I feel comfortable around people.",
            "E4n": "I keep in the background.",
            "E5p": "I start conversations.",
            "E6n": "I have little to say.",
            "E7p": "I talk to a lot of different people at parties.",
            "E8n": "I don't like to draw attention to myself.",
            "E9p": "I don't mind being the center of attention.",
            "E10n": "I am quiet around strangers.",
            "N1p": "I get stressed out easily.",
            "N2n": "I am relaxed most of the time.",
            "N3p": "I worry about things.",
            "N4n": "I seldom feel blue.",
            "N5p": "I am easily disturbed.",
            "N6p": "I get upset easily.",
            "N7p": "I change my mood a lot.",
            "N8p": "I have frequent mood swings.",
            "N9p": "I get irritated easily.",
            "N10p": "I often feel blue.",
            "A1n": "I feel little concern for others.",
            "A2p": "I am interested in people.",
            "A3n": "I insult people.",
            "A4p": "I sympathize with others' feelings.",
            "A5n": "I am not interested in other people's problems.",
            "A6p": "I have a soft heart.",
            "A7n": "I am not really interested in others.",
            "A8p": "I take time out for others.",
            "A9p": "I feel others' emotions.",
            "A10p": "I make people feel at ease.",
            "C1p": "I am always prepared.",
            "C2n": "I leave my belongings around.",
            "C3p": "I pay attention to details.",
            "C4n": "I make a mess of things.",
            "C5p": "I get chores done right away.",
            "C6n": "I often forget to put things back in their proper place.",
            "C7p": "I like order.",
            "C8n": "I shirk my duties.",
            "C9p": "I follow a schedule.",
            "C10p": "I am exacting in my work.",
            "O1p": "I have a rich vocabulary.",
            "O2n": "I have difficulty understanding abstract ideas.",
            "O3p": "I have a vivid imagination.",
            "O4n": "I am not interested in abstract ideas.",
            "O5p": "I have excellent ideas.",
            "O6n": "I do not have a good imagination.",
            "O7p": "I am quick to understand things.",
            "O8p": "I use difficult words.",
            "O9p": "I spend time reflecting on things.",
            "O10p": "I am full of ideas."
          };        
          
          this.qList = personalityQuestions;
          this.questions = Object.values(personalityQuestions);
    }

    render(element) {
        element.innerHTML = '';
        
        for (let i = 0; i < this.questions.length; ++i) {
            const quest = document.createElement('div');
            quest.classList.add('question');
            quest.innerText = this.questions[i];
            element.appendChild(quest);
        

            const options = ['SD', 'D', 'N', 'A', 'SA'];

            for (let j = 0; j < options.length; j++) {
                let label = document.createElement('label');
                let button = document.createElement('input');
                button.type = 'radio';
                button.value = j + 1; 
                button.name = "question " + i.toString();
                button.classList.add('option');
                label.appendChild(button);
                label.appendChild(document.createTextNode(options[j])); 
                element.appendChild(label);
                
            }

            element.appendChild(document.createElement('br'));
        }
    }

    calculateScore() {
        let scores = {"E": 0, "A": 0, "C": 0, "N": 0, "O": 0};
        let cats = Object.keys(this.qList);

        for (let i = 0; i < this.questions.length; ++i) {
            let elements = document.getElementsByName("question " + i.toString());
            let score = 0; 
            for (let j = 0; j < elements.length; ++j) {
                if (elements[j].checked) {
                    score = parseInt(elements[j].value);
                    score = ((score - 1)*5) - 10; // possible values: -10 -5 0 5 10
                    break;
                }
            }

            let cat = cats[i].split('');
            if (cat[cat.length - 1] == "p") {
                scores[cat[0]] += score;
            }
            else {
                scores[cat[0]] -= score;
            }

            if (scores[cat[0]] <= 0) {
                scores[cat[0]] = 0;
            }

        }

        return scores;        
    }

    compareScores(score1, score2) {
        let outputs = [];
        let traits = {
            "E": "extraversion", 
            "A": "agreeableness", 
            "C": "conscientiousness", 
            "N": "neuroticism", 
            "O": "openness"
        };

        console.log(score1);

        for (const key of Object.keys(score1)) {
            let diff = score1[key] - score2[key];
            if (diff > 0) {
                outputs.push(`you are ${diff} points higher than your friend in ${traits[key]}`);
            }
            else if (diff == 0) {
                outputs.push(`you and your friend are equal in ${traits[key]}!`);
            }
            else {
                outputs.push(`your friend is ${Math.abs(diff)} points higher than you in ${traits[key]}`);
            }
        }

        return outputs;

    }


}