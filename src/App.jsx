import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [totalPetals, setTotalPetals] = useState(0);
  const [remainingPetals, setRemainingPetals] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [fallingPetals, setFallingPetals] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Oyunu başlat
  const startGame = () => {
    // 6 ile 12 arasında rastgele TEK sayı seç (son yaprak her zaman "seviyor" olsun)
    let petalCount = Math.floor(Math.random() * 4) * 2 + 7; // 7, 9, 11, 13
    if (petalCount > 12) petalCount = 11;
    if (petalCount < 6) petalCount = 7;
    
    setTotalPetals(petalCount);
    setRemainingPetals(petalCount);
    setCurrentText('');
    setFallingPetals([]);
    setGameStarted(true);
  };

  useEffect(() => {
    startGame();
  }, []);

  const handlePetalClick = () => {
    if (remainingPetals === 0) {
      // Oyunu yeniden başlat
      startGame();
      return;
    }

    const newRemaining = remainingPetals - 1;
    const clickedPetalIndex = totalPetals - remainingPetals;
    
    // Yaprak sayısına göre metin belirle
    // Son yaprak her zaman "Seviyor ❤️" olacak
    const isLast = newRemaining === 0;
    const text = isLast ? 'Seviyor ❤️' : (remainingPetals % 2 === 1 ? 'Seviyor ❤️' : 'Sevmiyor 💔');
    
    setCurrentText(text);
    setRemainingPetals(newRemaining);

    // Düşen yaprak animasyonu ekle
    const newFallingPetal = {
      id: Date.now(),
      angle: (clickedPetalIndex * 360) / totalPetals,
      isLast: isLast
    };
    
    setFallingPetals(prev => [...prev, newFallingPetal]);

    // Düşen yaprağı 2 saniye sonra temizle
    setTimeout(() => {
      setFallingPetals(prev => prev.filter(p => p.id !== newFallingPetal.id));
    }, 2000);
  };

  // Yaprakları oluştur
  const renderPetals = () => {
    const petals = [];
    for (let i = 0; i < remainingPetals; i++) {
      const angle = (i * 360) / totalPetals;
      petals.push(
        <div
          key={i}
          className="petal"
          style={{
            transform: `rotate(${angle}deg) translateY(-50px)`
          }}
        />
      );
    }
    return petals;
  };

  return (
    <div className="App" onClick={handlePetalClick}>
      <div className="container">
        <h1 className="title">Papatya Falı</h1>
        
        <div className="text-display">
          {currentText && <div className="love-text">{currentText}</div>}
          {remainingPetals === 0 && (
            <div className="restart-text">Tekrar oynamak için tıkla! 🌼</div>
          )}
        </div>

        <div className="flower-container">
          {/* Papatya */}
          <div className="flower">
            {/* Yapraklar */}
            <div className="petals-container">
              {renderPetals()}
            </div>
            
            {/* Çiçek merkezi */}
            <div className="flower-center"></div>
          </div>

          {/* Sap */}
          <div className="stem"></div>
        </div>

        {/* Düşen yapraklar */}
        {fallingPetals.map(petal => (
          <div
            key={petal.id}
            className={`falling-petal ${petal.isLast ? 'last-petal' : ''}`}
            style={{
              left: '50%',
              top: '40%',
              transform: `rotate(${petal.angle}deg)`
            }}
          />
        ))}

        <div className="instruction">
          {remainingPetals > 0 ? 'Yaprağı koparmak için tıkla...' : ''}
        </div>
      </div>
    </div>
  );
}

export default App;
