document.addEventListener('DOMContentLoaded', () => {
    let productList = [];

    const getFormData = () => ({
        productName: document.getElementById('productName').value,
        shippingCost: document.getElementById('shippingCost').value,
        curves: document.getElementById('curves').value,
        unitsPerCurve: document.getElementById('unitsPerCurve').value,
        purchaseCost: document.getElementById('purchaseCost').value,
        estimatedProfit: document.getElementById('estimatedProfit').value
    });

    const calculateCosts = () => {
        const formData = getFormData();
        const shipping = parseFloat(formData.shippingCost);
        const curves = parseInt(formData.curves);
        const units = parseInt(formData.unitsPerCurve);
        const purchase = parseFloat(formData.purchaseCost);
        const profit = parseFloat(formData.estimatedProfit);

        if ([shipping, curves, units, purchase, profit].some(isNaN)) {
            alert('Please fill all numeric fields with valid numbers');
            return;
        }

        const shippingPerProduct = Math.ceil((shipping / curves) * 10) / 10;
        const total = purchase + shippingPerProduct;
        const perUnit = total / units;
        const selling = perUnit * profit;

        document.getElementById('resultProductName').textContent = formData.productName;
        document.getElementById('resultShippingCost').textContent = shippingPerProduct.toFixed(2);
        document.getElementById('resultTotalCost').textContent = total.toFixed(2);
        document.getElementById('resultCostPerUnit').textContent = perUnit.toFixed(2);
        document.getElementById('resultSellingPrice').textContent = selling.toFixed(2);

        return { selling };
    };

    const addProduct = () => {
        const formData = getFormData();
        if (!formData.productName) {
            alert('Por favor, ingrese el nombre del producto y calcule el precio primero');
            return;
        }

        const results = calculateCosts();
        const newProduct = {
            name: formData.productName,
            price: results.selling
        };

        productList.push(newProduct);
        updateProductList();
        alert('Producto agregado a la lista');
    };

    const updateProductList = () => {
        const container = document.getElementById('productListContainer');
        container.innerHTML = '';

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';

        // Add table header
        const header = table.createTHead();
        const headerRow = header.insertRow();
        const nameHeader = headerRow.insertCell();
        const priceHeader = headerRow.insertCell();
        nameHeader.textContent = 'Nombre del Producto';
        priceHeader.textContent = 'Precio de Venta';

        // Style header cells
        [nameHeader, priceHeader].forEach(cell => {
            cell.style.backgroundColor = '#f2f7fa';
            cell.style.padding = '8px';
            cell.style.fontWeight = 'bold';
            cell.style.borderBottom = '2px solid #d1e2f0';
        });

        // Add product rows
        productList.forEach(product => {
            const row = table.insertRow();
            const nameCell = row.insertCell();
            const priceCell = row.insertCell();
            nameCell.textContent = product.name;
            priceCell.textContent = `$${product.price.toFixed(2)}`;

            // Style data cells
            [nameCell, priceCell].forEach(cell => {
                cell.style.padding = '8px';
                cell.style.borderBottom = '1px solid #d1e2f0';
            });
        });

        container.appendChild(table);
    };

    const generatePDF = () => {
        if (productList.length === 0) {
            alert('La lista de productos está vacía');
            return;
        }

        const element = document.getElementById('pdfContent');
        const opt = {
            margin: 1,
            filename: 'lista-productos.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Ensure styles are applied before generating PDF
        const styles = window.getComputedStyle(element);
        element.style.backgroundColor = 'white';
        element.style.padding = '20px';

        html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(() => {
                // Reset styles after PDF generation
                element.style.backgroundColor = styles.backgroundColor;
                element.style.padding = styles.padding;
            });
    };

    // Event Listeners
    document.getElementById('calculateBtn').addEventListener('click', calculateCosts);
    document.getElementById('addBtn').addEventListener('click', addProduct);
    document.getElementById('pdfBtn').addEventListener('click', generatePDF);
});