document.addEventListener("DOMContentLoaded", function () {
    // Seleciona os elementos do formulário e inputs
    const formPartsRegistration = document.getElementById('partsRegistration');
    const inputProductName = document.getElementById('parts');
    const inputProductPrice = document.getElementById('prices');
    const inputProductAmount = document.getElementById('amount');
    const productList = document.getElementById('productList');
    const inputClientName = document.getElementById('name');
    const inputVehicle = document.getElementById('vehicle');
    const inputs = Array.from(document.querySelectorAll('.input-nav'));
    const submitBtn = document.getElementById('submitBtn');

    // Array para armazenar os produtos cadastrados
    const registeredProducts = [];

    // Adiciona navegação entre os inputs usando setas do teclado e Enter
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                event.preventDefault();
                if (inputs[index + 1]) {
                    inputs[index + 1].focus();
                }
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                event.preventDefault();
                if (inputs[index - 1]) {
                    inputs[index - 1].focus();
                }
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (inputs[index + 1]) {
                    inputs[index + 1].focus();
                } else {
                    submitBtn.focus();
                }
            }
        });
    });

    // Adiciona o evento de submissão do formulário
    formPartsRegistration.addEventListener("submit", function (event) {
        event.preventDefault();

        // Obtém e valida os valores dos inputs
        const productName = inputProductName.value.trim();
        const productPrice = parseFloat(inputProductPrice.value.trim());
        const productAmount = parseFloat(inputProductAmount.value.trim());

        if (productName && !isNaN(productPrice) && !isNaN(productAmount)) {
            // Cria um objeto de produto e adiciona ao array
            const product = {
                amount: productAmount,
                name: productName,
                price: productPrice
            };

            registeredProducts.push(product);

            // Limpa os campos de entrada
            inputProductName.value = "";
            inputProductPrice.value = "";
            inputProductAmount.value = '1';

            // Atualiza a lista de produtos e foca no primeiro input
            displayProducts();
            inputs[0].focus();
        }
    });

    // Função para exibir os produtos cadastrados
    function displayProducts() {
        productList.innerHTML = "";

        registeredProducts.forEach((product, i) => {
            const li = document.createElement('li');
            li.textContent = `${product.amount}  |  ${product.name}  | R$${product.price.toFixed(2)}`;
            productList.appendChild(li);

            const removeButton = document.createElement('button');
            removeButton.id = 'btnRemove';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 448 512');
            svg.classList.add('svgIcon');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z');
            svg.appendChild(path);
            removeButton.appendChild(svg);

            // Adiciona evento para remover produto
            removeButton.addEventListener('click', function () {
                removeProduct(i);
            });

            li.appendChild(removeButton);
            productList.appendChild(li);
        });
    }

    // Função para remover um produto
    function removeProduct(i) {
        if (i >= 0 && i < registeredProducts.length) {
            registeredProducts.splice(i, 1);
            displayProducts();
        }
    }

    // Função para calcular o total dos preços dos produtos
    function calculateTotal(products) {
        return products.reduce((total, product) => total + product.price, 0).toFixed(2);
    }

    // Função para calcular o total das quantidades dos produtos
    function calculateTotalItems(products) {
        return products.reduce((total, product) => total + product.amount, 0);
    }

    // Configura a impressão do orçamento
    const logoImage = new Image();
    logoImage.src = '../images/al.png';
    const printButton = document.getElementById('btn-print');

    printButton.addEventListener("click", () => {
        const printWindow = window.open('', '', 'width=1000,height=900');
        printWindow.document.write('<html><head><title>AL Motos Peças e Acessórios</title></head><body style="height: 100%">');
        printWindow.document.write('<img src="' + logoImage.src + '" style="width: 150px; height: 100px;"></img>');
        printWindow.document.write('<div style="display: inline-block; vertical-align: top; font-size: 13px;">');
        printWindow.document.write('<p>R: Reinaldo Schimithausen,1200 sala 2 <br> Cordeiros, Itajaí <br> CNPJ: 09.370.904/0001-83 <br> Fone: (47)3241-4450 <br> Celular: (47)99220-1818</p>');
        printWindow.document.write('</div>');
        printWindow.document.write('<br><br>');
        printWindow.document.write('Nome: ' + inputClientName.value);
        printWindow.document.write('<br>');
        printWindow.document.write('Modelo: ' + inputVehicle.value);
        printWindow.document.write('<h3 class="centro"><span>Orçamento</span></h3>');
        printWindow.document.write('<div style="border: 2px solid #000; padding: 10px;">');
        printWindow.document.write('<style>.centro { text-align: center; }</style>');
        printWindow.document.write('<table border="1" style="width: 100%;">');
        printWindow.document.write('<tr><th style="width: 15%">Qnt</th><th>Produto</th><th style="width: 20%">Preço</th></tr>');

        registeredProducts.forEach(product => {
            printWindow.document.write(`<tr><td>${product.amount} un</td><td>${product.name}</td><td>R$${product.price.toFixed(2)}</td></tr>`);
        });

        const total = calculateTotal(registeredProducts);
        const totalItems = calculateTotalItems(registeredProducts);

        printWindow.document.write('</table>');
        printWindow.document.write(`<div style="display: flex; justify-content: space-between;"> <p><span>Total: UN ${totalItems}</span></p> <p><span>Total: R$ ${total}</span></p></div>`);
        printWindow.document.write('</div>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
        location.reload();
    });
});
