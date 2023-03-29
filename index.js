const cuadrats = document.querySelectorAll('.cuadrat');
let tornJugador = 'J1';
let tauler = [['', '', ''], ['', '', ''], ['', '', '']];
let jugador2;
let torn = 0;
let J1 = document.querySelector('#J1')
let J2 = document.querySelector('#J2')
let divGuanyar = document.querySelector('#guanyar')
let tornActual = 'jugador'

//Funcio cada cop que es pica el boto canviar torn
document.querySelectorAll('.botons').forEach((x) => {
  x.onclick = function () {
    jugador2 = x.id == 'JJ';

    J2.innerText = !jugador2 ? 'Màquina' : 'Jugador 2';
    J1.innerText = !jugador2 ? 'You' : 'Jugador 1';

    document.getElementById('alert').classList.add('hidden');
    document.getElementById('numJ1').innerText = '0';
    document.getElementById('numJ2').innerText = '0';

    carregar();
  };
});

cuadrats.forEach((boto) => {
  boto.onclick = function () {
    if (boto.textContent != 'X' && boto.textContent != 'O') {
      const posicio = boto.id;
      const guanyat = guardarPosicio(posicio);
      if (guanyat == 'full') {
        setTimeout(()=>{
          divGuanyar.classList.remove('hidden')
          divGuanyar.querySelector('p').textContent = 'EMPAT!'
        },300)
      } else if (guanyat) {
        const nom = `num${tornJugador}`
        const number = document.getElementById(nom).textContent
        document.getElementById(nom).innerText = Number(number)+1;
        setTimeout(() => {
          divGuanyar.classList.remove('hidden')
          divGuanyar.querySelector('p').textContent = `${tornJugador} amb fitxes ${boto.textContent} HA GUANYAT`
        }, 600);
      }else{
        if (jugador2) tornJugador = tornJugador == 'J1' ? 'J2' : 'J1';
        else {
          setTimeout(() => {
            tornMaquina();
            
            tornJugador = 'J1';
            J1.classList.toggle('desActiu');
            J2.classList.toggle('desActiu');
          }, 300);
        }
        J1.classList.toggle('desActiu');
        J2.classList.toggle('desActiu');
      }
    }
  };
});

function carregar() {
  tauler = [['', '', ''], ['', '', ''], ['', '', '']];
  cuadrats.forEach((boto) => { boto.textContent = ''; });
  torn = 0;
  J1.classList.remove('desActiu');
  J2.classList.add('desActiu');
}

function guardarPosicio(posicio) {
  const botonet = document.getElementById(posicio);
  posicio = posicio.split('/');
  botonet.innerHTML = tornJugador == 'J1' ? '<p>X</p>' : '<p>O</p>';
  tauler[posicio[0]][posicio[1]] = botonet.textContent;
  return comprovarGeneral();
}

function comprovarGeneral() {
  if (combrovarHoritzontal()) return true;
  if (comprovarDiagonal()) return true;
  if (comprovarVertical()) return true;
  const y = tauler.some((element) => element.includes(''));
  if (!y) return 'full';
  return false;
}

function combrovarHoritzontal() {
  const arr = tauler.map((element) => element[0] === element[1] && element[1] === element[2] && element[0] !== '');
  return arr.toString().includes(true);
}

function comprovarVertical() {
  for (let i = 0; i < tauler.length; i++) {
    if ((tauler[0][i] === tauler[1][i]) && (tauler[1][i] === tauler[2][i]) && (tauler[i][i] !== '')) return true;
  }
  return false;
}

function comprovarDiagonal() {
  switch (true) {
    case (tauler[0][0] === tauler[1][1]) && (tauler[1][1] === tauler[2][2]) && (tauler[0][0] !== ''):
      return true;
    case (tauler[0][2] === tauler[1][1]) && (tauler[1][1] === tauler[2][0]) && (tauler[0][2] !== ''):
      return true;
  }
  return false;
}

function tornMaquina() {
  tornJugador = 'J2';
  if (torn == 0) tornZMaquina();
  else torn1Maquina();
}

function tornZMaquina() {
  let opcions;
  let posicio;
  switch (true) {
    case tauler[1][1] === 'X':
      opcions = ['0/0', '0/2', '2/0', '2/2'];
      posicio = opcions[Math.floor(Math.random() * 4)];
      guardarPosicio(posicio);
      break;

    case tauler[0][1] === 'X':
    case tauler[1][2] === 'X':
    case tauler[1][0] === 'X':
      if (tauler[1][0] == 'X') guardarPosicio('0/0');
      else guardarPosicio('0/2');
      break;
    case tauler[2][1] === 'X':
      opcions = ['2/0', '2/2'];
      posicio = Math.floor(Math.random() * 2);
      guardarPosicio(opcions[posicio]);
      break;
    default:
      guardarPosicio('1/1');
      break;
  }
  torn++;
}

function torn1Maquina() {
  let acabat;
  // POT GUANYAR
  const posHG = controlGuanyarHoritzontal('O');
  if (posHG !== 'vertical') acabat = guardarPosicio(posHG);
  else {
    const posVG = controlGuanyarVertical('O');
    if (posVG !== 'diagonal') acabat = guardarPosicio(posVG);
    else {
      const posDG = controlGuanyarDiagonal('O');
      if (posDG !== 'seguent') acabat = guardarPosicio(posDG);
    }
  }

  // CONTROL HORITZONTAL
  const posH = controlGuanyarHoritzontal('X');
  if (posH !== 'vertical') acabat = guardarPosicio(posH);
  else {
    // CONTROL VERTICAL
    const posV = controlGuanyarVertical('X');
    if (posV !== 'diagonal')acabat = guardarPosicio(posV);
    else {
      // CONTROL DIAGONAL
      const posD = controlGuanyarDiagonal('X');
      if (posD !== 'seguent') acabat = guardarPosicio(posD);
      else if(comprovarGeneral() !== 'full') { 
        const posicio = controPosicioRandom();
        acabat = guardarPosicio(posicio);
      }else{
        acabat = 'full'
      }
    }
  }
  torn++;

  // CONTROL SI LA MAQUINA HA GUANYAT
  if (acabat) {
    setTimeout(()=>{
      divGuanyar.classList.remove('hidden')
      divGuanyar.querySelector('p').textContent = `La maquina HA GUANYAT`
      carregar();
    },300)
    const number = document.getElementById('numJ2').textContent
    document.getElementById('numJ2').innerText = Number(number)+1;
  }

}

function controlGuanyarHoritzontal(lletra) {
  for (let i = 0; i < tauler.length; i++) {
    if (tauler[i].filter((x) => x == 'X' || x == 'O').length !== 3) {
      if (tauler[i].filter((x) => x === lletra).length == 2) {
        const index = tauler[i].findIndex((x) => x == '');
        const posicioFinal = `${i}/${index}`;
        return posicioFinal;
      }
    }
  }
  return 'vertical';
}

function controlGuanyarVertical(lletra) {
  for (let i = 0; i < tauler.length; i++) {
    const arr = [tauler[0][i], tauler[1][i], tauler[2][i]];
    if (arr.filter((x) => x == 'X' || x == 'O').length != 3) {
      const x = arr.filter((x) => x == lletra).length;
      if (x == 2) {
        let posicio;
        switch (true) {
          case tauler[0][i] == '':
            posicio = `0/${i}`;
            break;
          case tauler[1][i] == '':
            posicio = `1/${i}`;
            break;
          case tauler[2][i] == '':
            posicio = `2/${i}`;
            break;
        }
        return posicio;
      }
    }
  }
  return 'diagonal';
}

function controlGuanyarDiagonal(lletra) {
  const diagonal1 = [tauler[0][0], tauler[1][1], tauler[2][2]];
  const diagonal2 = [tauler[0][2], tauler[1][1], tauler[2][0]];
  if (diagonal1.filter((x) => x == 'X' || x == 'O').length != 3) {
    if (diagonal1.filter((x) => x == lletra).length == 2) {
      let posicio;
      switch (true) {
        case tauler[0][0] == '':
          posicio = '0/0';
          break;
        case tauler[1][1] == '':
          posicio = '1/1';
          break;
        case tauler[2][2] == '':
          posicio = '2/2';
          break;
      }
      return posicio;
    }
  }
  if (diagonal2.filter((x) => x == 'X' || x == 'O').length != 3) {
    if (diagonal2.filter((x) => x == lletra).length == 2) {
      let posicio;
      switch (true) {
        case tauler[0][2] == '':
          posicio = '0/2';
          break;
        case tauler[1][1] == '':
          posicio = '1/1';
          break;
        case tauler[2][0] == '':
          posicio = '2/0';
          break;
      }
      return posicio;
    }
  }
  return 'seguent';
}

function controPosicioRandom() {
  let index1;
  let index2;
  let buit;

  do {
    index1 = Math.floor(Math.random() * 3);
    index2 = Math.floor(Math.random() * 3);

    if (tauler[index1][index2] == '') {
      buit = true;
    } else {
      buit = false;
    }
  } while (!buit);
  return `${index1}/${index2}`;
}

document.getElementById('canviarTorn').addEventListener('click', () => {
  document.getElementById('alert').classList.remove('hidden');
});


document.getElementById('change').addEventListener('click', ()=>{
  divGuanyar.classList.add('hidden')
  document.getElementById('alert').classList.remove('hidden');
})
document.getElementById('tornaJugar').addEventListener('click', ()=>{
  divGuanyar.classList.add('hidden')
  carregar()
  if(tornActual==='maquina') console.log('aaaaaa')
})