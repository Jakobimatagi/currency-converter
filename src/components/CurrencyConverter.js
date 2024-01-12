import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [convertedAmount, setConvertedAmount] = useState('0.00');
    const [exchangeRate, setExchangeRate] = useState(null);

    const URL = `https://v6.exchangerate-api.com/v6/b0dd08baa055f56c75125282/pair/${fromCurrency}/${toCurrency}`
    const currencyCodes = [
        "USD", // United States Dollar
        "EUR", // Euro
        "GBP", // British Pound Sterling
        "AUD", // Australian Dollar
        "CAD", // Canadian Dollar
        "CHF", // Swiss Franc
        "JPY", // Japanese Yen
        "CNY", // Chinese Yuan
        "INR", // Indian Rupee
        // ... additional currency codes
    ];

    useEffect(() => {
        const getExchangeRate = async (uri) => {
            try {
                const response = await axios.get(uri);
                const rate = response.data.conversion_rate;
                setExchangeRate(rate);
            } catch (error) {
                console.error('Error fetching exchange rate:', error);
            }
        };

        if (fromCurrency !== toCurrency) {
            getExchangeRate(URL);
        } else {
            // If the 'from' and 'to' currencies are the same, set exchange rate to 1
            setExchangeRate(1);
        }
    }, [URL, fromCurrency, toCurrency]);
    const handleAmountChange = (e) => {
        let rawInput = e.target.value.replace(/[^0-9]/g, ''); // Remove any non-numeric characters

        // Convert raw input to cents
        let cents = parseInt(rawInput, 10);

        // Convert cents to a decimal format
        let decimal = (cents / 100).toFixed(2);

        setAmount(decimal);
    };

    const handleFromCurrencyChange = (event) => {
        setFromCurrency(event.target.value);
    };

    const handleToCurrencyChange = (event) => {
        setToCurrency(event.target.value);
    };

    const handleConvert = () => {
        if (!isNaN(amount) && exchangeRate) {
            const convertedValue = amount * exchangeRate;
            setConvertedAmount(convertedValue.toFixed(2));
        }
    };
    const handleClose = () => {
        setConvertedAmount('0.00');
        setAmount('');
    };

    return (
        <section className='landing-section'>
            <div className="row container">
                <div className="form">
                    <h1 className='landing-heading'>Currency Converter</h1>

                    <div className='input-wrapper'>
                        <label className='form-label'>
                            Amount:
                        </label>
                        <div className='text-input'>
                            <input
                                type="text"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="Enter number"
                                className='form-control'
                            />
                        </div>
                    </div>

                    <div className='input-wrapper'>
                        <label className='form-label'>
                            From Currency:
                        </label>
                        <div >
                            <select className='form-select' value={fromCurrency} onChange={handleFromCurrencyChange}>
                                {
                                    currencyCodes.map((currency) => (
                                        <option key={currency} value={currency}>
                                            {currency}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className='input-wrapper'>
                        <label className='form-label'>
                            To Currency:
                        </label>
                        <div >
                            <select className='form-select' value={toCurrency} onChange={handleToCurrencyChange}>
                                {
                                    currencyCodes.map((currency) => (
                                        <option key={currency} value={currency}>
                                            {currency}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className='button-wrapper'>
                        <button onClick={handleConvert} className='button-4'>Convert</button>
                        <button onClick={handleClose} className='button-4'>Clear</button>
                    </div>
                    <div className='converted-popup'>
                        <p>
                            Converted Amount:
                        </p>
                        <p>
                            {convertedAmount} {toCurrency}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CurrencyConverter