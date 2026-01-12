import React, { useState } from 'react'
import jsPDF from 'jspdf'
import './App.css'

// Product data with units
const productData = {
  Cement: { unit: 'bags', allowDecimal: false },
  Maorang: { unit: 'cubic feet', allowDecimal: true },
  Gitti: { unit: 'cubic feet', allowDecimal: true },
  Sariya: { unit: 'kg', allowDecimal: true },
  Ring: { unit: 'pieces', allowDecimal: false },
  Sand: { unit: 'cubic feet', allowDecimal: true },
  Bricks: { unit: 'pieces', allowDecimal: false },
  Tiles: { unit: 'sq ft', allowDecimal: true },
  Paint: { unit: 'liters', allowDecimal: true },
  'Steel Bars': { unit: 'kg', allowDecimal: true },
  Water: { unit: 'liters', allowDecimal: true },
  Wire: { unit: 'kg', allowDecimal: true },
  Pipe: { unit: 'meters', allowDecimal: true },
  'Binding Wire': { unit: 'kg', allowDecimal: true },
  'Wood Planks': { unit: 'cubic feet', allowDecimal: true },
  'PVC Pipes': { unit: 'meters', allowDecimal: true },
  'Electrical Fittings': { unit: 'pieces', allowDecimal: false }
}

// ProductRow Component
const ProductRow = ({ product, quantity, price, unit, allowDecimal, onQuantityChange, onPriceChange }) => {
  const subtotal = (parseFloat(price) || 0) * quantity

  return (
    <div className="product-row">
      <div className="product-info">
        <div className="product-name">{product}</div>
        <div className="product-unit">{unit}</div>
      </div>
      
      <div className="quantity-section">
        <div className="quantity-controls">
          <button 
            className="btn btn-minus" 
            onClick={() => onQuantityChange(Math.max(0, quantity - (allowDecimal ? 0.1 : 1)))}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <input
            type="number"
            className="quantity-input"
            value={quantity}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0
              onQuantityChange(Math.max(0, val))
            }}
            min="0"
            step={allowDecimal ? 0.1 : 1}
          />
          <button 
            className="btn btn-plus" 
            onClick={() => onQuantityChange(quantity + (allowDecimal ? 0.1 : 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="price-input-container">
        <span className="currency-symbol">₹</span>
        <input
          type="number"
          className="price-input"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="0"
          min="0"
          step="0.01"
        />
      </div>
      
      <div className="subtotal">
        ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const products = Object.keys(productData)
  
  const [quantities, setQuantities] = useState(() => {
    const initial = {}
    products.forEach(product => {
      initial[product] = 0
    })
    return initial
  })
  
  const [prices, setPrices] = useState(() => {
    const initial = {}
    products.forEach(product => {
      initial[product] = ''
    })
    return initial
  })

  // Handle quantity change for a product
  const handleQuantityChange = (product, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [product]: Math.max(0, newQuantity)
    }))
  }

  // Handle price change for a product
  const handlePriceChange = (product, newPrice) => {
    setPrices(prev => ({
      ...prev,
      [product]: newPrice
    }))
  }

  // Calculate subtotal for a product
  const calculateSubtotal = (product) => {
    const price = parseFloat(prices[product]) || 0
    return price * quantities[product]
  }

  // Calculate grand total
  const calculateGrandTotal = () => {
    return products.reduce((total, product) => {
      return total + calculateSubtotal(product)
    }, 0)
  }

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    // Header Background
    doc.setFillColor(102, 126, 234)
    doc.rect(0, 0, pageWidth, 35, 'F')
    
    // Title
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont(undefined, 'bold')
    doc.text('Construction Material Bill', 15, 22)
    
    // Date
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    const date = new Date().toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
    doc.text(`Date: ${date}`, 15, 30)
    
    // Reset text color
    doc.setTextColor(0, 0, 0)
    
    // Table header
    let y = 50
    doc.setFillColor(240, 240, 240)
    doc.rect(15, y - 8, pageWidth - 30, 10, 'F')
    
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(50, 50, 50)
    doc.text('Product', 20, y)
    doc.text('Qty', 75, y)
    doc.text('Unit', 95, y)
    doc.text('Price', 125, y)
    doc.text('Subtotal', 155, y)
    
    // Draw header underline
    doc.setDrawColor(102, 126, 234)
    doc.setLineWidth(0.8)
    doc.line(15, y + 2, pageWidth - 15, y + 2)
    
    // Table data
    y = 62
    doc.setFont(undefined, 'normal')
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    
    let rowCount = 0
    products.forEach(product => {
      const quantity = quantities[product]
      const price = parseFloat(prices[product]) || 0
      const subtotal = calculateSubtotal(product)
      const unit = productData[product].unit
      
      if (quantity > 0 || price > 0) {
        // Alternating row background
        if (rowCount % 2 === 0) {
          doc.setFillColor(250, 250, 250)
          doc.rect(15, y - 6, pageWidth - 30, 8, 'F')
        }
        
        // Draw row border
        doc.setDrawColor(220, 220, 220)
        doc.setLineWidth(0.3)
        doc.line(15, y + 2, pageWidth - 15, y + 2)
        
        doc.text(product, 20, y)
        
        // Format quantity with unit
        const quantityStr = productData[product].allowDecimal 
          ? quantity.toFixed(1) 
          : Math.round(quantity).toString()
        doc.text(quantityStr, 75, y)
        doc.text(unit, 95, y)
        
        // Format price as integer
        const priceInt = Math.round(price)
        const priceFormatted = priceInt.toLocaleString('en-IN')
        doc.text(`Rs. ${priceFormatted}`, 125, y)
        
        // Format subtotal as integer
        const subtotalInt = Math.round(subtotal)
        const subtotalFormatted = subtotalInt.toLocaleString('en-IN')
        doc.text(`Rs. ${subtotalFormatted}`, 155, y)
        
        y += 10
        rowCount++
        
        // Page break if needed
        if (y > 270) {
          doc.addPage()
          y = 20
        }
      }
    })
    
    // Grand Total
    const grandTotal = calculateGrandTotal()
    y += 5
    
    // Draw separator line
    doc.setDrawColor(150, 150, 150)
    doc.setLineWidth(0.5)
    doc.line(15, y, pageWidth - 15, y)
    
    y += 10
    
    // Grand Total background
    doc.setFillColor(102, 126, 234)
    doc.rect(15, y - 8, pageWidth - 30, 12, 'F')
    
    // Grand Total text
    doc.setFont(undefined, 'bold')
    doc.setFontSize(14)
    doc.setTextColor(255, 255, 255)
    doc.text('Grand Total:', 120, y + 2)
    doc.setFontSize(16)
    const grandTotalInt = Math.round(grandTotal)
    const grandTotalFormatted = grandTotalInt.toLocaleString('en-IN')
    const grandTotalText = `Rs. ${grandTotalFormatted}`
    doc.text(grandTotalText, pageWidth - 20, y + 2, { align: 'right' })
    
    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 15
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(15, footerY, pageWidth - 15, footerY)
    
    doc.setFontSize(8)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text('Thank you for your business!', pageWidth / 2, footerY + 5, { align: 'center' })
    
    // Save PDF
    doc.save('construction-material-bill.pdf')
  }

  const grandTotal = calculateGrandTotal()

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Construction Material Calculator</h1>
        
        <div className="products-card">
          <div className="products-header">
            <div className="header-product">Product</div>
            <div className="header-quantity">Quantity</div>
            <div className="header-price">Price</div>
            <div className="header-subtotal">Subtotal</div>
          </div>
          
          {products.map((product) => (
            <ProductRow
              key={product}
              product={product}
              quantity={quantities[product]}
              price={prices[product]}
              unit={productData[product].unit}
              allowDecimal={productData[product].allowDecimal}
              onQuantityChange={(newQuantity) => handleQuantityChange(product, newQuantity)}
              onPriceChange={(newPrice) => handlePriceChange(product, newPrice)}
            />
          ))}
        </div>
        
        <div className="total-card">
          <h2 className="total-title">Total Summary</h2>
          <div className="subtotals-list">
            {products.map((product) => {
              const subtotal = calculateSubtotal(product)
              if (quantities[product] > 0 || parseFloat(prices[product]) > 0) {
                return (
                  <div key={product} className="subtotal-item">
                    <span className="subtotal-product">
                      {product} ({productData[product].unit}):
                    </span>
                    <span className="subtotal-value">
                      ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )
              }
              return null
            })}
          </div>
          <div className="grand-total">
            <span className="grand-total-label">Grand Total:</span>
            <span className="grand-total-value">
              ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        
        <button className="btn btn-generate-pdf" onClick={generatePDF}>
          Generate PDF
        </button>
      </div>
    </div>
  )
}

export default App
