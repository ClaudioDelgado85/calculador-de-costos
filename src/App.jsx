import { useState, useRef } from 'react'
import { usePDF } from 'react-to-pdf'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    shippingCost: '',
    curves: '',
    unitsPerCurve: '',
    productName: '',
    purchaseCost: '',
    estimatedProfit: ''
  })

  const [results, setResults] = useState({
    shippingCostPerProduct: 0,
    totalCost: 0,
    costPerUnit: 0,
    sellingPrice: 0
  })

  const [productList, setProductList] = useState([])
  const pdfRef = useRef()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateCosts = () => {
    const shipping = parseFloat(formData.shippingCost)
    const curves = parseInt(formData.curves)
    const units = parseInt(formData.unitsPerCurve)
    const purchase = parseFloat(formData.purchaseCost)
    const profit = parseFloat(formData.estimatedProfit)

    if ([shipping, curves, units, purchase, profit].some(isNaN)) {
      alert('Please fill all numeric fields with valid numbers')
      return
    }

    const shippingPerProduct = Math.ceil((shipping / curves) * 10) / 10
    const total = purchase + shippingPerProduct
    const perUnit = total / units
    const selling = perUnit * profit

    setResults({
      shippingCostPerProduct: shippingPerProduct,
      totalCost: total,
      costPerUnit: perUnit,
      sellingPrice: selling
    })
  }

  const handleAddProduct = () => {
    if (!formData.productName || results.sellingPrice === 0) {
      alert('Por favor, ingrese el nombre del producto y calcule el precio primero')
      return
    }

    const newProduct = {
      name: formData.productName,
      price: results.sellingPrice
    }

    setProductList(prev => [...prev, newProduct])
    alert('Producto agregado a la lista')
  }

  const { toPDF } = usePDF()

  const handleGeneratePDF = () => {
    if (productList.length === 0) {
      alert('La lista de productos está vacía')
      return
    }
    toPDF(pdfRef, {
      filename: 'lista-productos.pdf',
      page: { margin: 20 }
    })
  }

  return (
    <div className="calculator-container">
      <h1>Calculadora de Costos de Producto</h1>
      
      <div className="form-group">
        <label>Nombre del Producto:</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          placeholder="Ingrese nombre del producto"
        />
      </div>

      <div className="form-group">
        <label>Costo de Envío (I1):</label>
        <input
          type="number"
          name="shippingCost"
          value={formData.shippingCost}
          onChange={handleInputChange}
          placeholder="Ingrese costo de envío"
        />
      </div>

      <div className="form-group">
        <label>Número de Curvas (C1):</label>
        <input
          type="number"
          name="curves"
          value={formData.curves}
          onChange={handleInputChange}
          placeholder="Ingrese número de curvas"
        />
      </div>

      <div className="form-group">
        <label>Unidades por Curva:</label>
        <input
          type="number"
          name="unitsPerCurve"
          value={formData.unitsPerCurve}
          onChange={handleInputChange}
          placeholder="Ingrese unidades por curva"
        />
      </div>

      <div className="form-group">
        <label>Costo de Compra:</label>
        <input
          type="number"
          name="purchaseCost"
          value={formData.purchaseCost}
          onChange={handleInputChange}
          placeholder="Ingrese costo de compra"
        />
      </div>

      <div className="form-group">
        <label>Ganancia Estimada (multiplicador):</label>
        <input
          type="number"
          name="estimatedProfit"
          value={formData.estimatedProfit}
          onChange={handleInputChange}
          placeholder="Ingrese multiplicador de ganancia"
        />
      </div>

      <div className="button-group">
        <button onClick={calculateCosts} className="calculate-btn">Calcular</button>
        <button onClick={handleAddProduct} className="add-btn">Agregar</button>
        <button onClick={handleGeneratePDF} className="pdf-btn">Generar PDF</button>
      </div>

      <div ref={pdfRef} className="pdf-content">
        <h2>Resumen de Productos</h2>
        <div className="results">
          <h3>Último Cálculo</h3>
          <p><strong>Producto:</strong> {formData.productName}</p>
          <p><strong>Costo de Envío por Producto:</strong> ${results.shippingCostPerProduct.toFixed(2)}</p>
          <p><strong>Costo Total:</strong> ${results.totalCost.toFixed(2)}</p>
          <p><strong>Costo por Unidad:</strong> ${results.costPerUnit.toFixed(2)}</p>
          <p><strong>Precio de Venta:</strong> ${results.sellingPrice.toFixed(2)}</p>
        </div>

        <div className="product-list">
          <h3>Lista de Productos</h3>
          {productList.map((product, index) => (
            <div key={index} className="product-item">
              <span><strong>{product.name}</strong></span>
              <span>Precio: ${product.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
