function hammingEncode(input, oddParity) {
    let entrada = input.split('').map(Number);
    let salida = [];
    let i = 0;

    // Insertar bits de redundancia
    while (entrada.length > 0) {
        let potencia = Math.pow(2, i);
        if (potencia === salida.length + 1) {
            salida.push(2); // Marcador de bit de redundancia
            i++;
        } else {
            salida.push(entrada.shift());
        }
    }

    // Convertir lista a array
    let arr = [...salida];

    // Calcular los bits de redundancia
    let contador = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 2) {
            let potencia = Math.pow(2, contador);
            let k = Math.log2(potencia);
            let suma = 0;

            for (let l = 1; l <= arr.length; l++) {
                if ((l & (1 << k)) && l !== potencia) {
                    suma += arr[l - 1];
                }
            }

            arr[i] = (suma % 2) ^ (oddParity ? 1 : 0);
            contador++;
        }
    }

    return {
        encoded: arr,
        structure: salida.map(num => num === 2 ? "R" : "D")
    };
}

function encodeHamming() {
    let input = document.getElementById("inputData").value;
    let oddParity = document.getElementById("parityToggle").checked;
    if (!/^[01]*$/.test(input)) {
        document.getElementById("output").innerText = "Entrada inválida. Por favor, ingrese una secuencia binaria.";
        return;
    }
    if (input === "") {
        document.getElementById("output").innerHTML = "";
        return;
    }
    let result = hammingEncode(input, oddParity);
    let tableHTML = `<table class='table table-bordered'>
                <tr><th>Posición</th>${result.encoded.map((_, i) => `<td>${i + 1}</td>`).join('')}</tr>
                <tr><th>Estructura</th>${result.structure.map(num => `<td class="${num === "R" ? "bit-r" : "bit-d"}">${num}</td>`).join('')}</tr>
                <tr><th>Bit</th>${result.encoded.map((num, i) => `<td class="${result.structure[i] === "R" ? "bit-r" : "bit-d"}">${num}</td>`).join('')}</tr>
            </table>`;
    document.getElementById("output").innerHTML = tableHTML;
}

function copyToClipboard() {
    let encodedBits = document.querySelectorAll("#output tr:last-child td:not(:first-child)");
    let bitsText = Array.from(encodedBits).map(td => td.innerText).join('');
    navigator.clipboard.writeText(bitsText).then(() => {
        let toast = new bootstrap.Toast(document.getElementById("toastCopy"));
        toast.show();
    }).catch(err => {
        console.error("Error al copiar: ", err);
    });
}