import React, { useState } from 'react'
import jsPDF from 'jspdf'
import './App.css'

// ProductRow Component
const ProductRow = ({ product, quantity, price, onQuantityChange, onPriceChange }) => {
  const subtotal = (parseFloat(price) || 0) * quantity

  return (
    <div className="product-row">
      <div className="product-name">{product}</div>
      
      <div className="quantity-controls">
        <button 
          className="btn btn-minus" 
          onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="quantity-display">{quantity}</span>
        <button 
          className="btn btn-plus" 
          onClick={() => onQuantityChange(quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
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
  const products = ['Cement', 'Maorang', 'Gitti', 'Sariya', 'Ring']
  
  const [quantities, setQuantities] = useState({
    Cement: 0,
    Maorang: 0,
    Gitti: 0,
    Sariya: 0,
    Ring: 0
  })
  
  const [prices, setPrices] = useState({
    Cement: '',
    Maorang: '',
    Gitti: '',
    Sariya: '',
    Ring: ''
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
    doc.setFillColor(102, 126, 234) // Purple gradient color
    doc.rect(0, 0, pageWidth, 35, 'F')
    
    // Title (on the left side)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont(undefined, 'bold')
    doc.text('Construction Material Bill', 15, 22)
    
    // Date (below title)
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    const date = new Date().toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
    doc.text(`Date: ${date}`, 15, 30)
    
    // Reset text color for content
    doc.setTextColor(0, 0, 0)
    
    // Table header with background
    let y = 50
    doc.setFillColor(240, 240, 240)
    doc.rect(15, y - 8, pageWidth - 30, 10, 'F')
    
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(50, 50, 50)
    doc.text('Product', 20, y)
    doc.text('Quantity', 85, y)
    doc.text('Price', 120, y)
    doc.text('Subtotal', 155, y)
    
    // Draw header underline
    doc.setDrawColor(102, 126, 234)
    doc.setLineWidth(0.8)
    doc.line(15, y + 2, pageWidth - 15, y + 2)
    
    // Table data
    y = 62
    doc.setFont(undefined, 'normal')
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    
    let rowCount = 0
    products.forEach(product => {
      const quantity = quantities[product]
      const price = parseFloat(prices[product]) || 0
      const subtotal = calculateSubtotal(product)
      
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
        doc.text(quantity.toString(), 85, y)
        // Format price as integer (no decimals)
        const priceInt = Math.round(price)
        const priceFormatted = priceInt.toLocaleString('en-IN')
        doc.text(`Rs. ${priceFormatted}`, 120, y)
        // Format subtotal as integer
        const subtotalInt = Math.round(subtotal)
        const subtotalFormatted = subtotalInt.toLocaleString('en-IN')
        doc.text(`Rs. ${subtotalFormatted}`, 155, y)
        y += 10
        rowCount++
      }
    })
    
    // Grand Total section
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
    // Format grand total as integer
    const grandTotalInt = Math.round(grandTotal)
    const grandTotalFormatted = grandTotalInt.toLocaleString('en-IN')
    const grandTotalText = `Rs. ${grandTotalFormatted}`
    doc.text(grandTotalText, pageWidth - 20, y + 2, { align: 'right' })
    
    // Footer line
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    const footerY = doc.internal.pageSize.getHeight() - 15
    doc.line(15, footerY, pageWidth - 15, footerY)
    
    // Footer text
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
                    <span className="subtotal-product">{product}:</span>
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
