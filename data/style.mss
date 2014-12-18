/*
 * Tile Mill style sheet used for generating 
 * the base map tiles showing the existing
 * pedestrian accessibility data from the 
 * OpenStreetMap dataset.
 */

Map {
  background-color: #b8dee6;
}

#countries {
  ::outline {
    line-color: #85c5d3;
    line-width: 2;
    line-join: round;
  }
  polygon-fill: #fff;
}

#planetosmpolygon {
  [natural="water"] {
    polygon-fill: #b8dee6;
  }
  [natural="wetland"] {
    polygon-fill: #b8dee6;
  }
}

#planetosmline {  
  
  // show smaller road detail when zoomed close
  [zoom > 11] {
    [highway="road"] {
      line-color: #ddd;
      line-width: 1;
    }
    [highway="residential"] {
      line-color: #ddd;
      line-width: 1;
    }
    [highway="tertiary"] {
      line-color: #ddd;
      line-width: 1;
    }
    [highway="service"] {
      line-color: #ddd;
      line-width: 1;
    }
    
    [foot="yes"] {
      line-color: #f55;
    }
    [highway="footway"] {
      line-color: #f55;
    }
    [highway="path"] {
      line-color: #f55;
    }
  }
}


#planetosmroads {
  line-color: #aaa;
  line-width: 1;
  
  [highway="secondary"] {
    line-color: #ddd;
    line-width: 3;
  }
  [highway="motorway_link"] {
    line-color: #ddd;
    line-width: 5;
  }
  [highway="motorway"] {
    line-color: #ddd;
    line-width: 5;
  }
}


/*
 *	WALKABLE STUFF FROM planetosmroads
 */
#planetosmroads {
  [foot="yes"] {
    line-color: #f55;
  }
}

/*
 *	WALKABLE STUFF FROM planetosmline
 */
#planetosmline { 
  [foot="yes"] {
    line-color: #f55;
  }
  [highway="footway"] {
    line-color: #f55;
  }
  [highway="path"] {
    line-color: #f55;
  }

}

/*
 *	Town labels
 */
#planetosmpoint {
  [population > 3000] {
    	text-name: [name];
    	text-face-name: 'Helvetica Light';
  		text-size: 14;
  		text-wrap-width: 100;
 		text-wrap-before: true;
    	[zoom < 11] {
    		text-size: 10;
    	}
    }
	[population > 6000] {
    	text-name: [name];
    	text-face-name: 'Helvetica Bold';
  		text-size: 20;
  		text-wrap-width: 100;
 		text-wrap-before: true;
    	[zoom < 11] {
    		text-size: 12;
    	}
    }
  	
}
