import Landmark from "./landmark.js";
import Nottingham from "./nottingham.js";

class Face{
    constructor(){    
        this.landmarks = [];
        this.nottingham = new Nottingham();
    }
    
    setLandmarks(landmarks, width, height){
      var i =0;
      for (const land of landmarks){
        this.landmarks.push(new Landmark(i, parseInt(land.x * width), parseInt(land.y * height)));
        i++;
      }
    }

    getXbyId(id){
      for (const land of this.landmarks){
        if (land.number == id){
          return land.x;
        }
      }
    }

    getYbyId(id){
      for (const land of this.landmarks){
        if (land.number == id){
          return land.y;
        }
      }
    }
}

export default Face;