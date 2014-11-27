$(function(){

	window.mineVar={};
	window.mineFxn={};

	window.mineVar.mineArr=[];
	window.mineVar.tileValueArr=[];
	window.mineVar.gridHeight;
	window.mineVar.gridWidth;
	window.mineVar.totalMines;
	window.mineVar.isGameOver="N";
	window.mineVar.minesRemaining;
	window.mineVar.isGameStarted="N";
	window.mineVar.isGameWon="N";
	window.mineVar.timerInSecs=0;
	window.mineVar.miscArr=[];
	window.mineVar.pixelVal=30;
	window.mineVar.blinkCount=0;
	window.mineVar.isVisitedArr=[];
	
	window.mineFxn.init=function(){
		$("div#gameContainer").hide();
		$("div#mineGridStats").hide();
		$("#emojiButton").css({"cursor":"pointer"});
	};
	
	window.mineFxn.startGame=function(){
		window.mineVar.blinkCount=0;
		window.mineVar.isGameOver="N";
		window.mineVar.isGameStarted="N";
		window.mineVar.isGameWon="N";
		window.mineVar.timerInSecs=0;
		window.mineVar.tileValueArr.length=0;
		window.mineVar.mineArr.length=0;
		window.mineVar.miscArr.length=0;
		$("div#footer #timer").text("\u25BA"+" 0");
		$("div#footer").css("font-size","120%");
		
		//$("div#homeButtonDiv").css("font-size","120%");
		
		$("div#footer #emojiButton").attr("src","img/smiled.png");
		var difficulty=$("input[name=difficultyLevel]:checked").val();
		var pixelVal=window.mineVar.pixelVal+(window.mineVar.gridWidth*2);
		switch(difficulty){
			case "0": 	window.mineFxn.initSize(9,9);
						//window.mineFxn.generateMines(10);
						window.mineVar.minesRemaining=10;
						$("div#mineGrid").width((pixelVal*9)+"px");
						$("div#footer").width((pixelVal*9)+"px");
						$(".tile").css("height",window.mineVar.pixelVal);
						$(".tile").css("width",window.mineVar.pixelVal);
						$(".tiled").css("height",window.mineVar.pixelVal-5);
						$(".tiled").css("width",window.mineVar.pixelVal-5);
						break;
			case "1":	window.mineFxn.initSize(16,16);
						//window.mineFxn.generateMines(40);
						window.mineVar.minesRemaining=40;
						
						$("div#mineGrid").width((pixelVal*16)+"px");
						$("div#footer").width((pixelVal*16)+"px");
						break;
			case "2": 	window.mineFxn.initSize(16,30);
						//window.mineFxn.generateMines(99);
						window.mineVar.minesRemaining=99;
						$("div#mineGrid").width((pixelVal*30)+"px");
						$("div#footer").width((pixelVal*30)+"px");
						break;
					
			default: 	var height=$("#gridHeight").val();
						var width=$("#gridWidth").val();
						var mines=$("#totalNoOfMines").val();
						window.mineVar.totalMines=mines;
						if(height<3 || width<3 ){
							alert("Height and Width should be atleast 3");
							return false;
						}
						if((height*width)<12){
							alert("Atleast on among Height and Width should be greater than 3");
							return false;
						}
						if(mines <2){
							alert("Have atleast 2 mines, so it will be fun!!");
							return false;
						}
						if(mines >=(height*width)-9){
							alert("Too many mines!! It won't be fun!!");
							return false;
						}
						$("div#mineGrid").width((pixelVal*width)+"px");
						$("div#footer").width((pixelVal*width)+"px");
						window.mineFxn.initSize(height,width);
						//window.mineFxn.generateMines(mines);
						window.mineVar.minesRemaining=mines;
						break;
					
		}
		$("div#mineGridDetails").fadeOut();
		$("div#gameContainer").fadeIn(1000);
		
		$("div#footer #minesLeft").html(window.mineVar.minesRemaining+" \u2692");
		//window.mineFxn.fillTileValues();
		for(var tileIndex=0;tileIndex<(window.mineVar.gridHeight*window.mineVar.gridWidth); tileIndex++){
			window.mineVar.isVisitedArr[tileIndex]=0;
		}
		window.mineFxn.generateGrid();
		
		if(window.mineVar.gridHeight>14){
				
				var buttonHeight=(window.screen.height-100)/window.mineVar.gridHeight - window.mineVar.gridHeight;
				$(".tile").css("height",buttonHeight);
				$(".tile").css("width",buttonHeight);
				$(".tiled").css("height",buttonHeight-5);
				$(".tiled").css("width",buttonHeight-5);
				
				
		}
		else{
		
		}
		window.mineFxn.attachRightClickEvent();
		window.mineFxn.attachDbClkEvent();
	};
	
	window.mineFxn.initSize=function(gridHeight, gridWidth){
		window.mineVar.gridHeight=gridHeight;
		window.mineVar.gridWidth=gridWidth;
		
	};
	
	
	window.mineFxn.generateMines=function(totalMines,exceptionArray){
		
		$("div#footer #minesLeft").html(""+window.mineVar.minesRemaining+" \u2692");
		
		window.mineVar.totalMines=totalMines;
	
		var totalTiles=window.mineVar.gridWidth*window.mineVar.gridHeight;
		window.mineVar.mineArr.length=0;     
		for(var i=0;i<totalMines;i++){
			var tempMine;

			do{
				tempMine=Math.round((Math.random()*100000)%(totalTiles));
			}while(window.mineVar.mineArr.indexOf(tempMine)!=-1 || exceptionArray.indexOf(tempMine)!=-1|| tempMine>=totalTiles);

			window.mineVar.mineArr.push(tempMine);
		}
	
		//window.mineVar.mineArr=[28, 63, 48, 35, 75, 67, 7, 13, 61, 63];//14, 11, 1, 56, 36, 81, 19, 12, 2, 66];
	};

	window.mineFxn.hasMine=function(xPos, yPos/* , gridWidth */ ){
		var mineIndex=(yPos*window.mineVar.gridWidth)+xPos;
		//console.log("mine index is",mineIndex);
		if(window.mineVar.mineArr.indexOf(mineIndex)==-1){
			return false;
		}
		else{
			return true;
		}
	};
	
	window.mineFxn.calculateTileValue=function(xPos, yPos ){
		if(window.mineFxn.hasMine(xPos,yPos)==true){
			return -1;
		}
		
		var tileValue=0;
		var xLimit,yLimit
		var xLowerLimit, yLowerLimit;
		
		xLimit=xPos+1;
		yLimit=yPos+1;
		
		xLowerLimit=xPos-1;
		yLowerLimit=yPos-1;
		
		if(xPos+1==window.mineVar.gridWidth){
			xLimit=xPos;
		}
		if(yPos+1==window.mineVar.gridHeight){
			yLimit=yPos;
		}
		if(yPos==0){
			yLowerLimit=yPos;
		}
		if(xPos==0){
			xLowerLimit=xPos;
		}
		
		//if(xPos==0 && yPos==0){
			
			//console.log("1");
			for(var i=xLowerLimit;i<=xLimit;i++){
				for(var j=yLowerLimit;j<=yLimit;j++){
				//console.log("i,j",i,j);
					//if(i!=xPos && j!=yPos){
						//console.log("i, j",window.mineFxn.hasMine(i,j),i ,j);
						if(window.mineFxn.hasMine(i,j)==true){
							tileValue++;
						}
					//}
				}
			}
	//	}
	/*	
		else if(xPos!=0 && yPos!=0){
			console.log("2");
			
			for(var i=xPos-1;i<=xLimit;i++){
				for(var j=yPos-1;j<=yLimit;j++){
					//if(i!=xPos && j!=yPos){
						if(window.mineFxn.hasMine(i,j)==true){
							tileValue++;
						}
					//}
				}
			}
		}
		else if(xPos==0 && yPos!=0){
		console.log("3");
			for(var i=xPos;i<=xLimit;i++){
				for(var j=yPos-1;j<=yLimit;j++){
					//if(i!=xPos && j!=yPos){
						if(window.mineFxn.hasMine(i,j)==true){
							tileValue++;
						}
					//}
				}
			}
		}
		else if(yPos==0 && xPos!=0){
		console.log("4");
			
			for(var i=xPos-1;i<=xLimit;i++){
			
				for(var j=yPos;j<=yLimit;j++){
				console.log("i,j",i,j);
					//if(i!=xPos && j!=yPos){
					console.log("i, j",window.mineFxn.hasMine(i,j),i ,j);
						if(window.mineFxn.hasMine(i,j)==true){
							tileValue++;
						}
					//}
				}
			}
		}
		
		else if(yPos==window.mineVar.gridHeight-1 && xPos==window.mineVar.gridWidth-1){
		console.log("5");
			for(var i=xPos-1;i<=xPos%window.mineVar.gridWidth;i++){
				for(var j=yPos-1;j<=yPos%window.mineVar.gridHeight;j++){
					//if(i!=xPos && j!=yPos){
						if(window.mineFxn.hasMine(i,j)==true){
							tileValue++;
						}
					//}
				}
			}
		}
		
		else if(yPos==window.mineVar.gridHeight-1 && xPos!=window.mineVar.gridWidth-1){
		console.log("6");
			for(var i=xPos-1;i<=(xPos+1)%window.mineVar.gridWidth;i++){
				for(var j=yPos-1;j<=yPos%window.mineVar.gridHeight;j++){
					//if(i!=xPos && j!=yPos){
						if(window.mineFxn.hasMine(i,j)==true){
							tileValue++;
						}
					//}
				}
			}
		}
		
		else if(yPos!=window.mineVar.gridHeight-1 && xPos==window.mineVar.gridWidth-1){
			console.log("7");
			for(var i=xPos-1;i<=xPos%window.mineVar.gridWidth;i++){
				for(var j=yPos-1;j<=(yPos+1)%window.mineVar.gridHeight;j++){
					//if(i!=xPos && j!=yPos){
						if(window.mineFxn.hasMine(i,j)==true){
							tileValue++;
						}
					//}
				}
			}
		}
		*/
		return tileValue;
	};
	
	window.mineFxn.fillTileValues=function(){
		
		for(var i=0;i<window.mineVar.gridWidth;i++){
			for(var j=0;j<window.mineVar.gridHeight;j++){
				//console.log("XXXXX");
				//console.log("filling values",(j*window.mineVar.gridHeight)+i);
				window.mineVar.tileValueArr[(j*window.mineVar.gridWidth)+i]=window.mineFxn.calculateTileValue(i,j);
				//window.mineVar.isVisitedArr[(j*window.mineVar.gridWidth)+i]=0;
			}
		}
	};

	window.mineFxn.generateGrid=function(){
		$("div#mineGrid").empty();
		for(var j=0;j<window.mineVar.gridHeight;j++){
			for(var i=0;i<window.mineVar.gridWidth;i++){
				$("div#mineGrid").append('<button class="tile" style="width:'+window.mineVar.pixelVal+'px; height:'+window.mineVar.pixelVal+'px;" id="v_'+((j*window.mineVar.gridWidth)+i)+'" onclick="window.mineFxn.openClusters(this.id)" isVisited="N"><img class="tiled tileOne"src="img/blank.png" /></button>');
			}
			$("div#mineGrid").append('<br>');
		}
		//$("button.tile").css("font-size","120%");
		//$(".tiled").css({"width":(window.mineVar.pixelVal-5)+"px", "height":(window.mineVar.pixelVal-5)+"px"});
		window.mineFxn.setMeasures();
	};
	
	window.mineFxn.openAllEmptyTiles=function(tileIndex){
		if(window.mineVar.isGameOver=="Y" || window.mineVar.isGameWon=="Y"){
			return;
		}
		var yPos=Math.floor(tileIndex/window.mineVar.gridWidth);
		var xPos=tileIndex%window.mineVar.gridWidth;
		
		//To scan all the 3X3 grid around the clicked tile and mark each as visited, if its visited.
		var xLimit,yLimit,xLowerLimit,yLowerLimit;
		xLimit=xPos+1;
		yLimit=yPos+1;
		
		xLowerLimit=xPos-1;
		yLowerLimit=yPos-1;
		
		if(xPos+1==window.mineVar.gridWidth){
			xLimit=xPos;
		}
		if(yPos+1==window.mineVar.gridHeight){
			yLimit=yPos;
		}
		if(yPos==0){
			yLowerLimit=yPos;
		}
		if(xPos==0){
			xLowerLimit=xPos;
		}
		//console.log("limits",xLowerLimit,yLowerLimit,xLimit,yLimit);
		$("#v_"+tileIndex).attr("disabled","disabled");
		//$("#v_"+tileIndex).attr("isVisited","Y");
		window.mineVar.isVisitedArr[tileIndex]=1;
		$("#v_"+tileIndex).attr("isMine","N");
		$("#v_"+tileIndex).addClass('marked');
		//Check if there is a neighbouring tile with zero value.
		for(var i=xLowerLimit;i<=xLimit;i++){
			for(var j=yLowerLimit;j<=yLimit;j++){
				//console.log("i,j",i,j);
				//if($("#v_"+((j*window.mineVar.gridWidth)+i)).attr("isVisited")!="Y"){
				if(window.mineVar.isVisitedArr[((j*window.mineVar.gridWidth)+i)]!=1){
					if(window.mineVar.tileValueArr[(j*window.mineVar.gridWidth)+i]==0){
						//console.log("asdf");
						window.mineFxn.openAllEmptyTiles((j*window.mineVar.gridWidth)+i);
					}
					else{
						//$("#v_"+((j*window.mineVar.gridWidth)+i)).val(window.mineVar.tileValueArr[(j*window.mineVar.gridWidth)+i]);
						$("#v_"+((j*window.mineVar.gridWidth)+i)).children('img').attr("src","img/"+window.mineVar.tileValueArr[(j*window.mineVar.gridWidth)+i]+".png");
						$("#v_"+((j*window.mineVar.gridWidth)+i)).addClass('marked');
						$("#v_"+((j*window.mineVar.gridWidth)+i)).attr("val",window.mineVar.tileValueArr[(j*window.mineVar.gridWidth)+i]);
						//$("#v_"+((j*window.mineVar.gridWidth)+i)).attr("isVisited","Y");
						window.mineVar.isVisitedArr[(j*window.mineVar.gridWidth)+i]=1;
						$("#v_"+((j*window.mineVar.gridWidth)+i)).attr("isMine","N");
					}
				}
			} 
		}
	/*	if(xPos!=0){
			//Check the value of tile to the left.
			if(window.mineVar.tileValueArr[tileIndex-1]==0){
				window.mineFxn.openAllEmptyTiles(tileIndex-1);
			}
			else{
				$("#v_"+tileIndex).val(window.mineVar.tileValueArr[tileIndex]);
			}
			
		}
		if(yPos!=0){
			//Check the value of tile above..
			if(window.mineVar.tileValueArr[((yPos-1)*window.mineVar.gridHeight)+xPos]==0){
				window.mineFxn.openAllEmptyTiles(((yPos-1)*window.mineVar.gridHeight)+xPos);
			}
			else{
				$("#v_"+tileIndex).val(window.mineVar.tileValueArr[tileIndex]);
			}
		}
		if(xPos!=window.mineVar.gridWidth-1){
			//Check the value of tile to the right.
			if(window.mineVar.tileValueArr[(yPos*window.mineVar.gridHeight)+xPos+1]==0){
				window.mineFxn.openAllEmptyTiles((yPos*window.mineVar.gridHeight)+xPos+1);
			}
			else{
				$("#v_"+tileIndex).val(window.mineVar.tileValueArr[tileIndex]);
			}
		}
		if(yPos!=window.mineVar.gridHeight-1){
			//Check the value of tile to the below.
			if(window.mineVar.tileValueArr[((yPos+1)*window.mineVar.gridHeight)+xPos]==0){
				window.mineFxn.openAllEmptyTiles(((yPos+1)*window.mineVar.gridHeight)+xPos);
			}
			else{
				$("#v_"+tileIndex).val(window.mineVar.tileValueArr[tileIndex]);
			}
		}
		*/
		if((window.mineVar.gridHeight*window.mineVar.gridWidth)-$("button.tile[isMine='N']").length==window.mineVar.totalMines){
			window.mineFxn.gameWon();
		}
	};
	
	
	window.mineFxn.openClusters=function(tileId){
		if(window.mineVar.isGameOver=="Y" || window.mineVar.isGameWon=="Y"){
			return;
		}
		var splitArr=tileId.split("_");
		var tileIndex=parseInt(splitArr[1]);
		var tileValue=window.mineVar.tileValueArr[tileIndex];
		
		/*
		if(window.mineVar.isGameStarted=="N" && tileValue==-1){
			if(tileValue==-1){
				window.mineFxn.startGame();
				$("#"+tileId).click();
			}
			
		}
		*/
		
		if(window.mineVar.isGameStarted=="N"){
			
			var yPos=Math.floor(tileIndex/window.mineVar.gridWidth);
			var xPos=tileIndex%window.mineVar.gridWidth;
			//To scan all the 9X9 grid around the clicked tile and mark each as visited, if its visited.
			var xLimit,yLimit,xLowerLimit,yLowerLimit;
			var tileValue=window.mineVar.tileValueArr[tileIndex];
			xLimit=xPos+1;
			yLimit=yPos+1;
			
			xLowerLimit=xPos-1;
			yLowerLimit=yPos-1;
			
			if(xPos+1==window.mineVar.gridWidth){
				xLimit=xPos;
			}
			if(yPos+1==window.mineVar.gridHeight){
				yLimit=yPos;
			}
			if(yPos==0){
				yLowerLimit=yPos;
			}
			if(xPos==0){
				xLowerLimit=xPos;
			}
			var exceptionArray=[];
			for(var i=xLowerLimit;i<=xLimit;i++){
				for(var j=yLowerLimit;j<=yLimit;j++){
					//console.log("i,j",i,j,$("#v_"+((j*window.mineVar.gridWidth)+i)));
					exceptionArray.push((j*window.mineVar.gridWidth)+i);
				} 
			}
			var difficulty=$("input[name=difficultyLevel]:checked").val();
			var pixelVal=window.mineVar.pixelVal+(window.mineVar.gridWidth*2);
			switch(difficulty){
				case "0": 	
							window.mineFxn.generateMines(10,exceptionArray);
							
							break;
				case "1":	
							window.mineFxn.generateMines(40,exceptionArray);
							
							
							break;
				case "2": 	
							window.mineFxn.generateMines(99,exceptionArray);
							
							break;
						
				default: 								
							window.mineFxn.generateMines(window.mineVar.totalMines,exceptionArray);
							break;
						
			}
			window.mineFxn.fillTileValues();
			//$("#"+tileId).click();
			//if(tileValue==-1){
				//window.mineFxn.startGame();
				
			//}
			
		}
		//else{
			window.mineVar.isGameStarted="Y";
			//console.log("clicked button id is",tileId);
			//console.log("associated values is ",tileValue);
			
			//if($("#"+tileId).attr("isVisited")=="Y" || $("#"+tileId).attr("val")=="mine"){
			if(window.mineVar.isVisitedArr[tileIndex]==1 || $("#"+tileId).attr("val")=="mine"){
				return;
			}
			if(tileValue==-1){
				//TODO : show all tiles and print game over.
				window.mineFxn.gameOver();
			}
			else if(tileValue>0){
				//console.log($("#"+splitArr[0]+"_"+tileIndex));
				//$("#"+splitArr[0]+"_"+tileIndex).val(tileValue);
				$("#"+splitArr[0]+"_"+tileIndex).attr("val",tileValue);
				$("#"+splitArr[0]+"_"+tileIndex).children('img').attr("src","img/"+tileValue+".png");
				$("#"+splitArr[0]+"_"+tileIndex).addClass('marked');
				//$("#"+splitArr[0]+"_"+tileIndex).attr("isVisited","Y");
				window.mineVar.isVisitedArr[tileIndex]=1;
				$("#"+splitArr[0]+"_"+tileIndex).attr("isMine","N");
				//if($("button.tile[isMine!='Y']").length==(window.mineVar.gridHeight*window.mineVar.gridWidth)-window.mineVar.totalMines){
				if((window.mineVar.gridHeight*window.mineVar.gridWidth)-$("button.tile[isMine='N']").length==window.mineVar.totalMines){
					window.mineFxn.gameWon();
				}
			}
			else{
				window.mineFxn.openAllEmptyTiles(tileIndex);
			}
		//}
		
	};
	
	window.mineFxn.openAdjacentTiles=function(tileIndex){
		if(window.mineVar.isGameOver=="Y" || window.mineVar.isGameWon=="Y"){
			return;
		}
		
		if($("#v_"+tileIndex).attr("val")=="mine"){
			return;
		}
	
		var yPos=Math.floor(tileIndex/window.mineVar.gridWidth);
		var xPos=tileIndex%window.mineVar.gridWidth;
		//To scan all the 9X9 grid around the clicked tile and mark each as visited, if its visited.
		var xLimit,yLimit,xLowerLimit,yLowerLimit;
		var tileValue=window.mineVar.tileValueArr[tileIndex];
		xLimit=xPos+1;
		yLimit=yPos+1;
		
		xLowerLimit=xPos-1;
		yLowerLimit=yPos-1;
		
		if(xPos+1==window.mineVar.gridWidth){
			xLimit=xPos;
		}
		if(yPos+1==window.mineVar.gridHeight){
			yLimit=yPos;
		}
		if(yPos==0){
			yLowerLimit=yPos;
		}
		if(xPos==0){
			xLowerLimit=xPos;
		}

		//$("#v_"+tileIndex).attr("isVisited","Y");
		window.mineVar.isVisitedArr[tileIndex]=1;
		$("#v_"+tileIndex).addClass('marked');
		//Check if there is a neighbouring tile with zero value.
		var markedMines=[];		
		var tileValCount=0;
		for(var i=xLowerLimit;i<=xLimit;i++){
			for(var j=yLowerLimit;j<=yLimit;j++){
				//console.log("i,j",i,j,$("#v_"+((j*window.mineVar.gridWidth)+i)));
				if($("#v_"+((j*window.mineVar.gridWidth)+i)).attr("val")=="mine"){
					markedMines.push((j*window.mineVar.gridWidth)+i);
					tileValCount++;			
				}
			} 
		}
		
		if(tileValue==tileValCount){
			console.log(markedMines);
			for(var i=0;i<markedMines.length;i++){
				
				if(window.mineVar.mineArr.indexOf(markedMines[i])==-1){
					window.mineFxn.gameOver();
					return;
				}
			}
			
			for(var i=xLowerLimit;i<=xLimit;i++){
				for(var j=yLowerLimit;j<=yLimit;j++){
					//console.log("i,j",i,j,$("#v_"+((j*window.mineVar.gridWidth)+i)));
					//if($("#v_"+((j*window.mineVar.gridWidth)+i)).attr("isVisited")!="Y"){
					if(window.mineVar.isVisitedArr[(j*window.mineVar.gridWidth)+i]!=1){
						if(window.mineVar.isGameOver=="N"){
							$("#v_"+((j*window.mineVar.gridWidth)+i)).click();
						}			
					}
				} 
			}
		}
		else{
			//console.log("tile value, tile Val",tileValue, tileValCount);
			var beforeImg=$("#v_"+tileIndex).children('img').attr("src");
			var imgNameArr=beforeImg.split(".png");
			
			$("#v_"+tileIndex).fadeOut(0,function(){
				$("#v_"+tileIndex).children('img').attr("src",imgNameArr[0]+"not.png");
				$("#v_"+tileIndex).fadeIn(500,function(){
					
					$("#v_"+tileIndex).hide();
					$("#v_"+tileIndex).children('img').attr("src",beforeImg);
					$("#v_"+tileIndex).fadeIn(500);
				});
			});
		}
	};
	
	window.mineFxn.gameOver=function(){
		window.mineVar.isGameOver="Y";
			
		for(var i=0;i<window.mineVar.mineArr.length;i++){
			if($("#v_"+window.mineVar.mineArr[i]).attr("val")!="mine"){
				$("#v_"+window.mineVar.mineArr[i]).attr("val","mine");
				$("#v_"+window.mineVar.mineArr[i]).children('img').attr("src","img/mine1.png");
			}
		}
		
		for(var i=0;i<window.mineVar.tileValueArr.length;i++){
			//if($("#v_"+i).attr("val")=="mine" && $("#v_"+i).attr("isVisited")=="Y" && window.mineVar.tileValueArr[i]!=-1){
			if($("#v_"+i).attr("val")=="mine" && window.mineVar.isVisitedArr[i]==1 && window.mineVar.tileValueArr[i]!=-1){
				window.mineVar.miscArr.push(i);
			}
		}
		$("div#footer #emojiButton").attr("src","img/dumb.png");
		
		window.mineFxn.updateStats();
		alert("GAME OVER");
		
		//while(window.mineVar.isGameOver=="Y"){
	
		//};
	/*	if($.cookie("gamesPlayed")!=undefined){
			$.cookie("gamesPlayed",parseInt($.cookie("gamesPlayed"))+1);
		}
		else{
			$.cookie("gamesPlayed",1);
		}
		
		if($.cookie("gamesLost")!=undefined){
			$.cookie("gamesLost",parseInt($.cookie("gamesLost"))+1);
		}
		else{
			$.cookie("gamesLost",1);
		}
		*/
		
	};
	
	window.mineFxn.gameWon=function(){
		window.mineVar.isGameWon="Y";
		$("div#footer #emojiButton").attr("src","img/awesome.png");
		for(var i=0;i<window.mineVar.mineArr.length;i++){
							
			$("#v_"+window.mineVar.mineArr[i]).attr("val","mine");
			//$("#v_"+window.mineVar.mineArr[i]).attr("disabled","disabled");
			//if($("#v_"+window.mineVar.mineArr[i]).attr("isVisited")=="Y"){
			if(window.mineVar.isVisitedArr[window.mineVar.mineArr[i]]==1){	
				//$("#v_"+window.mineVar.mineArr[i]).attr("disabled","disabled");
			}
			else{
				$("#v_"+window.mineVar.mineArr[i]).children('img').attr("src","img/green.png");
				//$("#v_"+window.mineVar.mineArr[i]).attr("val",window.mineVar.tileValueArr[(j*window.mineVar.gridWidth)+i]);
			}
		}
		window.mineFxn.updateStats();
		alert("Congrats! You win\nTime taken : "+window.mineVar.timerInSecs+"secs");
	/*	
		if($.cookie("gamesPlayed")!=undefined){
			$.cookie("gamesPlayed",parseInt($.cookie("gamesPlayed"))+1);
		}
		else{
			$.cookie("gamesPlayed",1);
		}
		
		if($.cookie("gamesWon")!=undefined){
			$.cookie("gamesWon",parseInt($.cookie("gamesWon"))+1);
		}
		else{
			$.cookie("gamesWon",1);
		}
		if($.cookie("bestTime")==undefined){
			$.cookie("bestTime",window.mineVar.timerInSecs);
		}
		else{
			if(parseInt($.cookie("bestTime"))>window.mineVar.timerInSecs){
				$.cookie("bestTime",window.mineVar.timerInSecs);
			}
		}
	*/
		
	};
	
	window.mineFxn.attachRightClickEvent=function(){
				
		$("button.tile").mouseup(function(event){
			
			if(window.mineVar.isGameOver=="Y" || window.mineVar.isGameWon=="Y"){
				return;
			}
			if(event.which==3){
				console.log(event.target.localName);
				var targetDom;
				
				if(event.target.localName=="img"){
					targetDom=$(event.target).parent();
				}
				else if(event.target.localName=="button"){
					targetDom=$(event.target);
				}
				else{
					alert("Something went wrong! Use firefox/chrome");
					return;
				}
				
				var targetDomTileIndex=targetDom.attr("id").split("_")[1];
				//if(targetDom.attr("isVisited")=="N"){
				if(window.mineVar.isVisitedArr[targetDomTileIndex]==0){
					targetDom.attr("val","mine");
					targetDom.children('img').attr("src","img/red.png");
					window.mineVar.isVisitedArr[targetDomTileIndex]=1;
					//targetDom.attr("isVisited","Y");
					window.mineVar.minesRemaining--;
					$("div#footer #minesLeft").html(window.mineVar.minesRemaining+" \u2692");
					//$(event.target).append('<img src="lock.png"/>');
				}
				else{
					if(targetDom.attr("val")=="mine"){
						targetDom.attr("val","");
						targetDom.children('img').attr("src","img/blank.png");
						//targetDom.attr("isVisited","N");
						window.mineVar.isVisitedArr[targetDomTileIndex]=0;
						window.mineVar.minesRemaining++;
						$("div#footer #minesLeft").html(window.mineVar.minesRemaining+" \u2692");
					}
				}
				//$("#"+event.target.attributes.id).val("F");
			}
			if(event.which==1){
				$("div#footer #emojiButton").attr("src","img/smiled.png");
			}
			//event.preventDefault();
			
		});
		
		
		$("button.tile").mousedown(function(event){
			if(window.mineVar.isGameOver=="N" && event.which==1){
				$("div#footer #emojiButton").attr("src","img/worried.png");
			}
		});
		
		$("*").mouseup(function(event){
			
			if(window.mineVar.isGameOver=="N" && window.mineVar.isGameWon=="N" && event.which==1){
				$("div#footer #emojiButton").attr("src","img/smiled.png");
			}
		});
	};
	
	window.mineFxn.attachDbClkEvent=function(){
		
		$("button.tile").dblclick(function(event){
			console.log("event",$(event.target));
			var targetDom;
			if(event.target.localName=="img"){
				targetDom=$(event.target).parent();
			}
			else if(event.target.localName=="button"){
				targetDom=$(event.target);
			}
			else{
				alert("Something went wrong! Use firefox/chrome");
				return;
			}
			//console.log($(e.target).attr("id").split("_")[1]);
			window.mineFxn.openAdjacentTiles(targetDom.attr("id").split("_")[1]);
		});
		
	};
	
	window.mineFxn.timer=function(){
		window.mineVar.timerInSecs++;
		if(window.mineVar.isGameStarted=="Y"){
			$("div#footer #timer").text("\u25BA"+" "+window.mineVar.timerInSecs++);
		}
	};
	
	window.mineFxn.playAgain=function(){
		if(window.mineVar.isGameOver=="Y" || window.mineVar.isGameWon=="Y" || window.mineVar.isGameStarted=="N" ){
			window.mineFxn.startGame();
		}
		else{
			var result=confirm("Are you sure?");
			if(result==true){
				window.mineFxn.startGame();
			}
			else{
				return false;
			}
		}
	};
	window.mineFxn.backToMainMenu=function(){
		if(window.mineVar.isGameOver=="Y" || window.mineVar.isGameWon=="Y" || window.mineVar.isGameStarted=="N" ){
					$("div#gameContainer").fadeOut();
		}
		else{
			var result=confirm("The game is in progress. Are you sure? ");
			if(result==true){
						$("div#gameContainer").fadeOut();
			}
			else{
				return false;
			}
		}
		$("div#gameContainer").fadeOut();
		$("div#mineGridDetails").fadeIn();
	};
	
	window.mineFxn.backToGame=function(){
		$("div#gameContainer").fadeIn();
		$("div#mineGridDetails").hide();
		$("div#mineGridStats").fadeOut();
	};
	
	window.mineFxn.updateStats=function(){
		var difficulty=$("input[name=difficultyLevel]:checked").val();
		var cookieName="";
		if(difficulty=="0"){
			cookieName="got_begin_cookie";
		}
		else if(difficulty=="1"){
			cookieName="got_intermediate_cookie";
		}
		else if(difficulty=="2"){
			cookieName="got_expert_cookie";
		}
		if(cookieName!=""){
			if($.cookie(cookieName)==undefined){
				var obj={};
				obj.gamesPlayed=1;
				if(window.mineVar.isGameOver=="Y"){
					obj.gamesLost=1;
					obj.gamesWon=0;
					obj.bestTime=9999999;
				}
				else if(window.mineVar.isGameWon=="Y"){
					obj.gamesWon=1;
					obj.gamesLost=0;
					obj.bestTime=window.mineVar.timerInSecs;
				}
				console.log(JSON.stringify(obj));
				$.cookie(cookieName,JSON.stringify(obj));
			}
			else{
				var obj=JSON.parse($.cookie(cookieName));
				obj.gamesPlayed++;
				if(window.mineVar.isGameOver=="Y"){
					obj.gamesLost++;
				}
				else if(window.mineVar.isGameWon=="Y"){
					obj.gamesWon++;
					if(obj.bestTime>window.mineVar.timerInSecs){
						obj.bestTime=window.mineVar.timerInSecs;
					}
				}
				$.cookie(cookieName,JSON.stringify(obj));
			}
		}			
	};
	
	window.mineFxn.showStats=function(){
		$("div#gameContainer").fadeOut();
		$("div#mineGridStats").fadeIn();
		$("div#mineGridDetails").hide();
		$("input#clearStatsButton").fadeIn();
		$("#mineGridStatsTableDiv").hide();
		$("#clearedStats").hide();
		$("#mineGridNoStatsYet").hide();
		$("#mineGridStatsTableDiv").fadeIn();
		$("#multiselectForLevels").fadeIn();
		//if($.cookie("gamesPlayed")==undefined){
			//Print no stats avlb and return;
		//	return;
		//}
		
		var selectedLevel=$("#levelSelectForStats").val();
		var cookieName="";
		if(selectedLevel=="0"){
			cookieName="got_begin_cookie";
		}
		else if(selectedLevel=="1"){
			cookieName="got_intermediate_cookie";
		}
		else if(selectedLevel=="2"){
			cookieName="got_expert_cookie";
		}
		if(cookieName!=""){
			var obj=$.cookie(cookieName);
			if(obj==undefined){
				$("#mineGridStatsTableDiv").hide();
				$("#mineGridNoStatsYet").fadeIn();
			}
			else{
				obj=JSON.parse($.cookie(cookieName));
				$("#mineGridNoStatsYet").hide();
				$("#mineGridStatsTableDiv").fadeIn();
				
				$("#gamesPlayedTd").text(obj.gamesPlayed);
				$("#gamesWonTd").text(obj.gamesWon);
				$("#gamesLostTd").text(obj.gamesLost);
				if(obj.bestTime==9999999){
					$("#bestTimeTd").text("No Timings Yet!");
				}
				else{
					$("#bestTimeTd").text(obj.bestTime+" secs");
				}
				
			}
		}
	/*	
		var gamesPlayed=$.cookie("gamesPlayed");
		if(gamesPlayed==undefined){
			gamesPlayed=0;
		}
		var gamesWon=$.cookie("gamesWon");
		if(gamesWon==undefined){
			gamesWon=0;
		}
		var gamesLost=$.cookie("gamesLost");
		if(gamesLost==undefined){
			gamesLost=0;
		}
		var bestTime=$.cookie("bestTime");
		if(bestTime==undefined){
			bestTime="No timings yet!";
		}
		else{
			bestTime=bestTime+" secs";
		}
		$("div#mineGridStatsVal").empty();
		$("div#mineGridStatsVal").append("<h2>Statistics</h2>");
		$("div#mineGridStatsVal").append(
			"<table>"+
			"<tr><td>Played : </td><td>"+gamesPlayed+"</td></tr><br>"+
			"<tr><td>Won    : </td><td>"+gamesWon+"</td></tr><br>"+
			"<tr><td>Lost   : </td><td>"+gamesLost+"<td></tr></table><br><hr><br>"+
			"Best Time : "+bestTime
		);
		*/
	};
	
	window.mineFxn.clearStats=function(){
		
		var result=confirm("All stats will be cleared! Are you sure? ");
		if(result==true){
			try{
				$.removeCookie("got_begin_cookie");
			}
			catch(e){
			
			}
			try{
				$.removeCookie("got_intermediate_cookie");
			}
			catch(e){
			
			}
			try{
				$.removeCookie("got_expert_cookie");
			}
			catch(e){
			
			}
		}
		else{
			return false;
		}

		$("#mineGridStatsTableDiv").hide();
		$("#multiselectForLevels").hide();		
		$("div#clearedStats").fadeIn();
		$("input#clearStatsButton").hide();
		$("#mineGridNoStatsYet").hide();
	
		
	};
	
	window.mineFxn.setMeasures=function(){
		var pixelVal=window.mineVar.pixelVal+(window.mineVar.gridWidth*2);
		if(window.mineVar.gridWidth<13){
		
			$(".tile").css("height",window.mineVar.pixelVal);
			$(".tile").css("width",window.mineVar.pixelVal);
			$(".tiled").css("height",window.mineVar.pixelVal-5);
			$(".tiled").css("width",window.mineVar.pixelVal-5);
			
			$("div#mineGrid").width((pixelVal*window.mineVar.gridWidth)+"px");
			$("div#footer").width((pixelVal*window.mineVar.gridWidth)+"px");
		}
		
		else if(window.mineVar.gridWidth==16 && window.mineVar.gridHeight==16){
		
			$(".tile").css("height",window.mineVar.pixelVal-2);
			$(".tile").css("width",window.mineVar.pixelVal-2);
			$(".tiled").css("height",window.mineVar.pixelVal-5);
			$(".tiled").css("width",window.mineVar.pixelVal-5);
			
			$("div#mineGrid").width(((window.mineVar.pixelVal+2)*window.mineVar.gridWidth)+"px");
			$("div#footer").width(((window.mineVar.pixelVal+2)*window.mineVar.gridWidth)+"px");
		}
		
		else if(window.mineVar.gridWidth==30 && window.mineVar.gridHeight==16){
		
			$(".tile").css("height",window.mineVar.pixelVal-2);
			$(".tile").css("width",window.mineVar.pixelVal-2);
			$(".tiled").css("height",window.mineVar.pixelVal-5);
			$(".tiled").css("width",window.mineVar.pixelVal-5);
			
			$("div#mineGrid").width(((window.mineVar.pixelVal+2)*window.mineVar.gridWidth)+"px");
			$("div#footer").width(((window.mineVar.pixelVal+2)*window.mineVar.gridWidth)+"px");
		}
	};
	setInterval(function(){
		if($("div#gameContainer").is(":visible") && window.mineVar.isGameStarted=="Y" && window.mineVar.isGameOver=="N" && window.mineVar.isGameWon=="N"){
			$("div#footer #timer").text("\u25BA"+" "+ ++window.mineVar.timerInSecs);
		}}, 1000);
		
	setInterval(function(){
		if( window.mineVar.isGameOver=="Y"){
			if(window.mineVar.blinkCount==0){
				for(var i=0;i<window.mineVar.miscArr.length;i++){
					$("#v_"+window.mineVar.miscArr[i]).children('img').attr("src","img/redIncorrect.png");
					window.mineVar.blinkCount++;
				}
			}
		
		
			for(var i=0;i<window.mineVar.miscArr.length;i++){

				if($("#v_"+window.mineVar.miscArr[i]).children('img').attr("src")=="img/"+window.mineVar.tileValueArr[window.mineVar.miscArr[i]]+".png"){
					//$("#v_"+window.mineVar.miscArr[i]).val(window.mineVar.tileValueArr[window.mineVar.miscArr[i]]);
					//$("#v_"+window.mineVar.miscArr[i]).attr("val",window.mineVar.tileValueArr[window.mineVar.miscArr[i]]);
					$("#v_"+window.mineVar.miscArr[i]).children('img').attr("src","img/redIncorrect.png");
				}
				else if($("#v_"+window.mineVar.miscArr[i]).children('img').attr("src")=="img/redIncorrect.png"){
					//$("#v_"+window.mineVar.miscArr[i]).attr("val","mine");
					//$("#v_"+window.mineVar.miscArr[i]).children('img').attr("src","img/mine1.png");
					$("#v_"+window.mineVar.miscArr[i]).children('img').attr("src","img/"+window.mineVar.tileValueArr[window.mineVar.miscArr[i]]+".png");
				}
			/*	else if($("#v_"+window.mineVar.miscArr[i]).children('img').attr("src")=="img/mine1.png"){
					$("#v_"+window.mineVar.miscArr[i]).children('img').attr("src","img/"+window.mineVar.tileValueArr[window.mineVar.miscArr[i]]+".png");
				}
			*/
				$("#v_"+window.mineVar.miscArr[i]).hide();
				$("#v_"+window.mineVar.miscArr[i]).fadeIn();
			}
		}
	}, 800);
		
		window.mineFxn.init();
	/*window.mineFxn.initSize(9,9);
	window.mineFxn.generateMines(10);
	window.mineFxn.fillTileValues();
	window.mineFxn.generateGrid();
	window.mineFxn.attachRightClickEvent();
	window.mineFxn.attachDbClkEvent(); */
});