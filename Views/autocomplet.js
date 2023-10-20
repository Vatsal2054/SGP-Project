console.log("File accessed by homepage!");
alert("File accessed by homepage!");

let availableKeywords = [
    { keyword: 'HTML', url: 'https://www.html.com' },
    { keyword: 'CSS', url: 'https://www.css.com' },
    { keyword: 'WEB DESIGN', url: 'https://www.webdesign.com' },
    { keyword: 'JAVA', url: 'https://www.java.com' },
    { keyword: 'java-script', url: 'https://www.cpp.com' },
    { keyword: 'Google', url: 'https://www.google.com' }
];

const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");

inputBox.onkeyup = function () {
    let result = [];
    let input = inputBox.value;
    if (input.length) {
        result = availableKeywords.filter((item) => {
            return item.keyword.toLowerCase().includes(input.toLowerCase());
        });

        console.log(result);
    }
    display(result);

    if (!result.length) {
        resultsBox.innerHTML = '';
    }
}

function display(result) {
    const content = result.map((item) => {
        return `<li onclick="selectInput(this)" data-url="${item.url}">${item.keyword}</li>`;
    });

    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

function selectInput(list) {
    const selectedUrl = list.getAttribute("data-url");
    if (selectedUrl) {
        // Redirect to the URL associated with the keyword
        window.location.href = selectedUrl;
    } else {
        inputBox.value = list.innerHTML;
        resultsBox.innerHTML = '';
    }
}



