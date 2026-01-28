import React, { useState, useEffect } from 'react';
import { SWORD_DATA } from './swordData';
import './SwordGame.css';

const SwordGame = () => {



  const [balance, setBalance] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [blessedSwordLevel, setBlessedSwordLevel] = useState(-1);
  const currentSword = SWORD_DATA[currentLevel] || SWORD_DATA[SWORD_DATA.length - 1];
  const swordImgSrc = currentSword.img;

  const totalBlessedIncome = SWORD_DATA
    .slice(0, blessedSwordLevel + 1)
    .reduce((acc, sword) => acc + (sword.blessedIncome || 0), 0);

  // 1초마다 잔액 업데이트
  useEffect(() => {
    if (totalBlessedIncome <= 0) return;
    const timer = setInterval(() => {
      setBalance(prev => prev + totalBlessedIncome);
    }, 1000);

    return () => clearInterval(timer);
  }, [totalBlessedIncome]);  


  const handleWield = () => {
    setBalance(prev => prev + currentSword.wieldPrice);
  }; // handleWield

  const handleStrengthen = () => {
    if (balance < currentSword.strengthenPrice) {
      alert("잔액이 부족합니다.");
      return;
    }

    setBalance(prev => prev - currentSword.strengthenPrice);
    
    if (Math.random() < currentSword.successRate) {
      setCurrentLevel(prev => prev + 1);
    } else {
      setCurrentLevel(Math.max(blessedSwordLevel, 0));
    }
  }; // handleStrengthen



  const handleTranscendence = () => {
          console.log(blessedSwordLevel);

    if (balance < currentSword.transcendencePrice) {
      alert("잔액이 부족합니다.");
      return;
    }

    if (currentLevel == blessedSwordLevel + 1) {
      setBlessedSwordLevel(currentLevel);
      
      alert(`${currentSword.name} 초월 성공!`);
    } else if (currentLevel <= blessedSwordLevel) {
      alert("이미 초월한 검입니다.");
      return;
    } else {
      alert("이전 검을 먼저 초월하세요.");
    }

    setBalance(prev => prev - currentSword.transcendencePrice);
  }; // handleTranscendence

  return (
    <div className="container">
      <div className="balance">잔액: $ {balance.toLocaleString()}</div>

      <div className="blessed-swords">
        {SWORD_DATA.slice(0, blessedSwordLevel + 1).map((sword, index) => (
          <div key={index} className="blessed-item">
            <img 
              src={sword.img} 
              alt={sword.name} 
              title={`${sword.name}의 은총`} 
              className="blessed-sword-icon" 
            />
            <span className="blessing-tooltip">{sword.name}의 은총</span>
            <span className="blessing-income">+$ {sword.blessedIncome}/sec</span>
          </div>
        ))}
      </div>
      
      <div className="sword-display">
        <img src={swordImgSrc} alt={`sword level ${currentLevel}`} className="sword-image" />
        <div className="sword">+{currentLevel} {currentSword.name}</div>
        <div className="strengthen-rate">성공률: {Math.floor(currentSword.successRate * 100)}%</div>
      </div>

      <div className="buttons">
        <button id="wield-btn" className="btn" onClick={handleWield}>
          휘두르기
          <span className="price">$ {currentSword.wieldPrice.toLocaleString()}</span>
        </button>
        <button id="strengthen-btn" className="btn" onClick={handleStrengthen}>
          강화하기
          <span className="price">$ {currentSword.strengthenPrice.toLocaleString()}</span>
        </button>
        <button id="transcendence-btn" className="btn" onClick={handleTranscendence}>
          초월하기
          <span className="price">$ {currentSword.transcendencePrice.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
};

export default SwordGame;