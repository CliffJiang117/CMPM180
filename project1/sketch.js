const STATE_NORMAL = 0;
const STATE_CONFORM = 1;

// Maybe change to random
const OPINION_COUNT = 30;

const REACTION_DISTANCE = 150;
const GAZE_DISTANCE = 8;

const STANDARD_TEXT = "10/10";
const STANDARD_SIZE = 30;

// position set
const POSITION_MARGIN = 70;

// text
const MIN_TEXT_SIZE = 22;
const MAX_TEXT_SIZE = 38;

// angle sets
const MIN_ANGLE = -Math.PI / 10;
const MAX_ANGLE = Math.PI / 10;

let opinions = [];


// Language lib
// From AI, most of them
const languagePool = [

  // Chinese
  {
    language: "Chinese",
    ratings: [
      "一 / 十",
      "二 / 十",
      "三 / 十",
      "四 / 十",
      "五 / 十",
      "六 / 十",
      "七 / 十",
      "八 / 十",
      "九 / 十"
    ]
  },

  // English
  {
    language: "English",
    ratings: [
      "one / ten",
      "two / ten",
      "three / ten",
      "four / ten",
      "five / ten",
      "six / ten",
      "seven / ten",
      "eight / ten",
      "nine / ten"
    ]
  },

  // Japanese
  // Japanese normaly use kanji but that will be the same as Chinese so I change that
  {
    language: "Japanese",
    ratings: [
      "いち / じゅう",
      "に / じゅう",
      "さん / じゅう",
      "よん / じゅう",
      "ご / じゅう",
      "ろく / じゅう",
      "なな / じゅう",
      "はち / じゅう",
      "きゅう / じゅう"
    ]
  },

  // Korean
  {
    language: "Korean",
    ratings: [
      "일 / 십",
      "이 / 십",
      "삼 / 십",
      "사 / 십",
      "오 / 십",
      "육 / 십",
      "칠 / 십",
      "팔 / 십",
      "구 / 십"
    ]
  },

  // French
  {
    language: "French",
    ratings: [
      "un / dix",
      "deux / dix",
      "trois / dix",
      "quatre / dix",
      "cinq / dix",
      "six / dix",
      "sept / dix",
      "huit / dix",
      "neuf / dix"
    ]
  },

  // Spanish
  {
    language: "Spanish",
    ratings: [
      "uno / diez",
      "dos / diez",
      "tres / diez",
      "cuatro / diez",
      "cinco / diez",
      "seis / diez",
      "siete / diez",
      "ocho / diez",
      "nueve / diez"
    ]
  },

  // German
  {
    language: "German",
    ratings: [
      "eins / zehn",
      "zwei / zehn",
      "drei / zehn",
      "vier / zehn",
      "fünf / zehn",
      "sechs / zehn",
      "sieben / zehn",
      "acht / zehn",
      "neun / zehn"
    ]
  },

  // Italian
  {
    language: "Italian",
    ratings: [
      "uno / dieci",
      "due / dieci",
      "tre / dieci",
      "quattro / dieci",
      "cinque / dieci",
      "sei / dieci",
      "sette / dieci",
      "otto / dieci",
      "nove / dieci"
    ]
  },

  // Portuguese
  {
    language: "Portuguese",
    ratings: [
      "um / dez",
      "dois / dez",
      "três / dez",
      "quatro / dez",
      "cinco / dez",
      "seis / dez",
      "sete / dez",
      "oito / dez",
      "nove / dez"
    ]
  },

  // Russian
  {
    language: "Russian",
    ratings: [
      "один / десять",
      "два / десять",
      "три / десять",
      "четыре / десять",
      "пять / десять",
      "шесть / десять",
      "семь / десять",
      "восемь / десять",
      "девять / десять"
    ]
  },

  // Ukrainian
  {
    language: "Ukrainian",
    ratings: [
      "один / десять",
      "два / десять",
      "три / десять",
      "чотири / десять",
      "п’ять / десять",
      "шість / десять",
      "сім / десять",
      "вісім / десять",
      "дев’ять / десять"
    ]
  },

  // Polish
  {
    language: "Polish",
    ratings: [
      "jeden / dziesięć",
      "dwa / dziesięć",
      "trzy / dziesięć",
      "cztery / dziesięć",
      "pięć / dziesięć",
      "sześć / dziesięć",
      "siedem / dziesięć",
      "osiem / dziesięć",
      "dziewięć / dziesięć"
    ]
  },

  // Greek
  {
    language: "Greek",
    ratings: [
      "ένα / δέκα",
      "δύο / δέκα",
      "τρία / δέκα",
      "τέσσερα / δέκα",
      "πέντε / δέκα",
      "έξι / δέκα",
      "επτά / δέκα",
      "οκτώ / δέκα",
      "εννέα / δέκα"
    ]
  },

  // Arabic
  {
    language: "Arabic",
    ratings: [
      "١ / ١٠",
      "٢ / ١٠",
      "٣ / ١٠",
      "٤ / ١٠",
      "٥ / ١٠",
      "٦ / ١٠",
      "٧ / ١٠",
      "٨ / ١٠",
      "٩ / ١٠"
    ]
  },

  // Persian
  {
    language: "Persian",
    ratings: [
      "۱ / ۱۰",
      "۲ / ۱۰",
      "۳ / ۱۰",
      "۴ / ۱۰",
      "۵ / ۱۰",
      "۶ / ۱۰",
      "۷ / ۱۰",
      "۸ / ۱۰",
      "۹ / ۱۰"
    ]
  },

  // Hebrew
  {
    language: "Hebrew",
    ratings: [
      "אחד / עשר",
      "שניים / עשר",
      "שלושה / עשר",
      "ארבעה / עשר",
      "חמישה / עשר",
      "שישה / עשר",
      "שבעה / עשר",
      "שמונה / עשר",
      "תשעה / עשר"
    ]
  },

  // Turkish
  {
    language: "Turkish",
    ratings: [
      "bir / on",
      "iki / on",
      "üç / on",
      "dört / on",
      "beş / on",
      "altı / on",
      "yedi / on",
      "sekiz / on",
      "dokuz / on"
    ]
  }

];


function setup() {

  createCanvas(
    windowWidth,
    windowHeight
  );

  textAlign(
    CENTER,
    CENTER
  );

  createOpinions();
}

function draw() {

  background(255);

  for (let opinion of opinions) {

    opinion.update();

    opinion.display();
  }
}


function createOpinions() {

  opinions = [];


  for (
    let i = 0;
    i < OPINION_COUNT;
    i++
  ) {

    // random language
    let languageData = random(languagePool);


    // random rating
    let rating = random(languageData.ratings);

    // random position
    let x = random(POSITION_MARGIN, width - POSITION_MARGIN);

    let y = random(POSITION_MARGIN, height - POSITION_MARGIN);


    opinions.push(
      new Opinion(
        languageData.language,
        rating,
        x,
        y
      )

    );
  }
}

class Opinion {

  constructor(
    language,
    text,
    x,
    y
  ) {

    this.language = language;
    this.originalText = text;
    this.x = x;
    this.y = y;

    this.originalColor =
      color(
        random(30, 230),
        random(30, 230),
        random(30, 230)
      );
    this.originalSize =
      random(
        MIN_TEXT_SIZE,
        MAX_TEXT_SIZE
      );

    // random angle
    this.originalAngle =
      random(
        MIN_ANGLE,
        MAX_ANGLE
      );


    // State machine
    this.state = STATE_NORMAL;
    this.previousState = STATE_NORMAL;

    // 0 = original
    // 1 = fully standardized
    this.conformity = 0;


    // Reserved data for later
    // How many times the mouse
    // has entered this opinion
    this.hoverCount = 0;
    // Total frames spent inside
    // STATE_CONFORM
    this.totalObservedTime = 0;

    // Reserved for permanent conformity
    this.memory = 0;

    // Mouse gaze
    this.gazeX = 0;
    this.gazeY = 0;
  }


  update() {

    let dx = mouseX - this.x;

    let dy = mouseY - this.y;


    let distance = sqrt(dx * dx + dy * dy);

    // State decision
    if (distance <REACTION_DISTANCE)
    {
      this.state = STATE_CONFORM;

    } else {
      this.state = STATE_NORMAL;
    }

    // if state change
    if (this.state !==this.previousState)
    {
      this.onStateChange(this.previousState, this.state);


      this.previousState = this.state;
    }


    // state behavior
    if (this.state === STATE_NORMAL)
    {

      this.updateNormalState();
    }

    else if (this.state === STATE_CONFORM)
    {

      this.updateConformState();
    }
    this.updateGaze(
      dx,
      dy,
      distance
    );
  }


  updateNormalState() {

    this.conformity =
      lerp(
        this.conformity,
        0,
        0.08
      );
  }

  updateConformState() {

    this.conformity =
      lerp(
        this.conformity,
        1,
        0.12
      );


    // keep recording this for possible later versions
    this.totalObservedTime++;
  }

  onStateChange(
    oldState,
    newState
  ) {

    // Mouse enters
    if (
      oldState === STATE_NORMAL &&
      newState === STATE_CONFORM
    ) {
      this.hoverCount++;

      console.log(
        this.language,
        this.originalText,
        "observed:",
        this.hoverCount
      );
    }


    // Mouse leaves
    if (
      oldState === STATE_CONFORM &&
      newState === STATE_NORMAL
    ) {

      console.log(
        this.language,
        "released"
      );
    }
  }
  updateGaze(
    dx,
    dy,
    distance
  ) {

    if (distance === 0)
    {

      return;
    }


    let directionX = dx / distance;

    let directionY = dy / distance;


    this.gazeX = directionX * GAZE_DISTANCE;

    this.gazeY =  directionY * GAZE_DISTANCE;
  }


  display() {

    push();

    translate(

      this.x +
      this.gazeX,

      this.y +
      this.gazeY

    );


    // Random angle -> straight
    let currentAngle =
      lerp(
        this.originalAngle,
        0,
        this.conformity
      );


    rotate(
      currentAngle
    );

    let currentSize =
      lerp(
        this.originalSize,
        STANDARD_SIZE,
        this.conformity
      );


    textSize(
      currentSize
    );
    // Original color -> black
    // If later version have background also add background to white
    let currentColor =
      lerpColor(

        this.originalColor,

        color(0),

        this.conformity
      );


    noStroke();

    //code found by AI
    let originalAlpha =255 *(1 - this.conformity);
    fill(
      red(currentColor),
      green(currentColor),
      blue(currentColor),
      originalAlpha
    );


    text(
      this.originalText,
      0,
      0
    );

    // Standardized text
    let conformAlpha = 255 * this.conformity;


    fill(
      0,
      conformAlpha
    );


    text(
      STANDARD_TEXT,
      0,
      0
    );


    pop();
  }
}

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );


  createOpinions();
}