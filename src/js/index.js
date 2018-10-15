(() => {
  const drawImage = (image) => {
    const canvas = document.getElementById('surface');
    const fx = new Distortion(canvas, image, 6, 0.4);
    window.setTimeout(() => {
      fx.start();
    }, 300);
  };

  const rotateText = (elementNode) => {
    const text = elementNode.innerText;
    const textLength = text.length;
    elementNode.innerText = '';
    for (let i = 1; i <= textLength; i += 1) {
      const characterNode = document.createElement('div');
      characterNode.className = `char${i}`;
      characterNode.innerText = text[i - 1];
      characterNode.style.transform = `rotate(180deg * ${i})`;
      elementNode.appendChild(characterNode);
    }
  };

  window.onload = () => {
    const innerCircle = document.getElementById('inner-text');
    const outerCircle = document.getElementById('outer-text');
    rotateText(innerCircle);
    rotateText(outerCircle);

    const img = new Image();
    img.addEventListener('load', () => drawImage(img), false);
    img.src = './assets/background.jpg';

    const mainCircle = document.getElementById('main-circle');
    mainCircle.style.opacity = 1;
  };
})();
