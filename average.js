function calculateAverage() {
    // Initialize 3 random numbers (between 1 and 100)
    let num1 = 5;
    let num2 = 4;
    let num3 = 3;

    // Calculate average
    let average = (num1 + num2 + num3) / 3;

    // Display result
    document.getElementById("result").innerHTML = `
        <p>First number: ${num1}</p>
        <p>Second number: ${num2}</p>
        <p>Third number: ${num3}</p>
        <p><strong>Average: ${average.toFixed(2)}</strong></p>
    `;
}