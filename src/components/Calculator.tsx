
import React, { useState } from 'react';
import { Calculator as CalculatorIcon } from 'lucide-react';

interface CalculatorProps {
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const buttons = [
    { label: 'C', action: clear, className: 'bg-red-500/20 text-red-200 hover:bg-red-500/30' },
    { label: 'CE', action: clearEntry, className: 'bg-red-500/20 text-red-200 hover:bg-red-500/30' },
    { label: '÷', action: () => inputOperation('÷'), className: 'bg-blue-500/20 text-blue-200 hover:bg-blue-500/30' },
    { label: '×', action: () => inputOperation('×'), className: 'bg-blue-500/20 text-blue-200 hover:bg-blue-500/30' },
    
    { label: '7', action: () => inputNumber('7'), className: 'bg-white/10 text-white hover:bg-white/20' },
    { label: '8', action: () => inputNumber('8'), className: 'bg-white/10 text-white hover:bg-white/20' },
    { label: '9', action: () => inputNumber('9'), className: 'bg-white/10 text-white hover:bg-white/20' },
    { label: '-', action: () => inputOperation('-'), className: 'bg-blue-500/20 text-blue-200 hover:bg-blue-500/30' },
    
    { label: '4', action: () => inputNumber('4'), className: 'bg-white/10 text-white hover:bg-white/20' },
    { label: '5', action: () => inputNumber('5'), className: 'bg-white/10 text-white hover:bg-white/20' },
    { label: '6', action: () => inputNumber('6'), className: 'bg-white/10 text-white hover:bg-white/20' },
    { label: '+', action: () => inputOperation('+'), className: 'bg-blue-500/20 text-blue-200 hover:bg-blue-500/30' },
    
    { label: '1', action: () => inputNumber('1'), className: 'bg-white/10 text-white hover:bg-white/20' },
    { label: '2', action: () => inputNumber('2'), className: 'bg-white/10 text-white hover:bg-white/20' },
    { label: '3', action: () => inputNumber('3'), className: 'bg-white/10 text-white hover:bg-white/20' },
    { label: '=', action: performCalculation, className: 'bg-green-500/20 text-green-200 hover:bg-green-500/30 row-span-2' },
    
    { label: '0', action: () => inputNumber('0'), className: 'bg-white/10 text-white hover:bg-white/20 col-span-2' },
    { label: '.', action: inputDecimal, className: 'bg-white/10 text-white hover:bg-white/20' },
  ];

  return (
    <div className="h-full flex flex-col bg-white/5 backdrop-blur-sm">
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalculatorIcon className="w-4 h-4 text-white/80" />
          <span className="text-white/90 font-medium">Calculator</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white"
        >
          ×
        </button>
      </div>

      {/* Display */}
      <div className="p-4 border-b border-white/10">
        <div className="bg-black/30 rounded-lg p-4 text-right">
          <div className="text-white text-2xl font-mono overflow-hidden">
            {display}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-4 gap-2 h-full">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className={`rounded-lg font-medium transition-colors ${button.className} ${
                button.label === '=' ? 'row-span-2' : ''
              } ${
                button.label === '0' ? 'col-span-2' : ''
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
