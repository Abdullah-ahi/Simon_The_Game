import './main.css';
import RedAudio from 'sounds/red.wav'
import BlueAudio from 'sounds/blue.wav'
import YellowAudio from 'sounds/yellow.wav'
import GreenAudio from 'sounds/green.wav'
const Game = {
  name: 'Game',
  data: () => ({
    red: RedAudio,
    blue: BlueAudio,
    yellow: YellowAudio,
    green: GreenAudio,
    gameStarted: false,
    gameRound: 0,
    computerIsPlaying: false,
    computerSteps: [],
    playerStep: 0,
    prevRandomButton: null,
    gameLevel: 'Средний',
    stepFrequency: null,
  }),
  methods: {
    handleClick(event){
      if (!this.computerIsPlaying){
        const audio = event.target.dataset.audio;
        let sound = new Audio(audio)
        sound.play()
        if (this.gameStarted){
          this.checkStep(event.target)
        }
      }else {
        return
      }
    },
    checkStep(button){
      let playerStepId = button.dataset.id;
      if (playerStepId !== this.computerSteps[this.playerStep]){ // Если игрок нажал не ту кнопку, которую нажал компьютер то завершаем игру
        setTimeout(() => {
          alert('Неверно! Вы проиграли');
        }, 800)
        this.gameOver();
        this.gameStarted = false;
        return
      }
      if (this.stepIsLast()){
        setTimeout(() => {
          alert(`Вы выиграли ${this.gameRound}-й уровень`);
          this.startGame()
          return
        }, 500)
      }
      this.playerStep += 1;
    },
    stepIsLast(){
      return this.playerStep == this.computerSteps.length - 1;
    },
    startGame(e){
      e && e.preventDefault();
      if (e && this.gameStarted && !this.computerIsPlaying){ // Игру нельзя завершить нажатием на кнопку "Завершить игру" пока играет компьютер
        this.finishGame();
      }else if (this.computerIsPlaying){ // Если играет компьютер, то просто выходим из функции
        return
      }else {
        this.clearPrevLevelData();
        this.gameStarted = true;
        this.gameRound += 1;
        this.computerIsPlaying = true;
        this.lightButtons()
      }
    },
    lightButtons(){
      const buttons = Array.from(document.querySelectorAll('.game-button'))
      for(let i=0; i < this.gameRound; i++){
        let randomButton = this.getRandomButton(buttons)
        setTimeout(() => {
          buttons[randomButton].classList.add('testButton');
          new Audio(buttons[randomButton].dataset.audio).play();
          this.saveClick(buttons[randomButton]);
        }, (this.stepFrequency * 0.83) * (i+1));
        setTimeout(() => {
          buttons[randomButton].classList.remove('testButton');
          if (this.computerFinishPlaying(i)){
            this.stopComputerPlaying()
          }
        }, (this.stepFrequency * 1.001) *(i+1));
      }
    },
    getRandomButton(buttons){
      while(true){
        let randomButton = Math.floor(Math.random() * buttons.length);
        if (randomButton == this.prevRandomButton){
          continue
        }else {
          this.prevRandomButton = randomButton;
          return randomButton;
        }
      }
    },
    computerFinishPlaying(step){
      return step == this.gameRound - 1
    },
    stopComputerPlaying(){
      setTimeout(() => {
        this.computerIsPlaying = false;
        // alert('Ваш ход')
      }, 1000)
    },
    saveClick(button){
      this.computerSteps.push(button.dataset.id)
    },
    clearPrevLevelData(){
      this.computerSteps.splice(0, this.computerSteps.length) // Удаляем из массива данные предыдущего уровня
      this.playerStep = 0; // Обнуляем ходы игрока из предыдущего уровня
    },
    gameOver(){
      this.computerSteps.splice(0, this.computerSteps.length) // Удаляем из массива данные предыдущего уровня
      this.playerStep = 0; // Обнуляем ходы игрока из предыдущего уровня
      this.gameRound = 0;
    },
    finishGame(){
      this.computerSteps.splice(0, this.computerSteps.length) // Удаляем из массива данные предыдущего уровня
      this.playerStep = 0; // Обнуляем ходы игрока из предыдущего уровня
      this.gameRound = 0;
      this.gameStarted = false;
      this.computerIsPlaying = false;
    },
    setLevel(){
      if (this.gameLevel == 'Легкий'){
        this.stepFrequency = 1500;
      }else if (this.gameLevel == 'Средний'){
        this.stepFrequency = 1000;
      }else {
        this.stepFrequency = 400
      }
    }



    //METHODS END
  },
  mounted(){
    this.setLevel()
  },
  updated(){
    this.setLevel()
  },
  template:  `
    <div>
      <div class="game-round-wrapper">Раунд <span class="game-round">{{gameRound}}</span></div>
      <div class='wrapper'>
        <div class="game-button red" :data-audio="red" data-id="red" @mousedown="handleClick"></div>
        <div class="game-button blue" :data-audio="blue" data-id="blue" @mousedown="handleClick"></div>
        <div class="game-button yellow" :data-audio="yellow" data-id="yellow" @mousedown="handleClick"></div>
        <div class="game-button green" :data-audio="green" data-id="green" @mousedown="handleClick"></div>
      </div>
      <a href="#" class="start-game-button" @click="startGame">{{gameStarted ? "Завершить игру" : "Начать игру"}}</a>

      <div class="game-control-block">
        <label for="level">Уровень игры</label>
        <select name="" id="level" v-model="gameLevel">
          <option value="Легкий">Легкий</option>
          <option value="Средний">Средний</option>
          <option value="Сложный">Сложный</option>
        </select>
      </div>
    </div>
  `
}

export default Game