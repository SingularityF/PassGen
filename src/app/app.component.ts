import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PassGen';
  textInputType = "password"
  outputInputType = "password"
  storedInputText = localStorage.getItem("inputText")
  keyValue = "";
  outputValue = "";

  refreshLS(text) {
    localStorage.setItem("inputText", text)
  }

  tryEncrypt(text, key, valid, elem, target) {
    let upperText = key.toUpperCase();
    this.keyValue = upperText;
    if (key.length == 4 && valid) {
      this.outputValue = this.getEncrypted(text, key);
      elem.blur();
      target.focus();
    }else if(key.length == 4 && !valid){
      elem.parentNode.classList.add("key-anim");
    }else{
      elem.parentNode.classList.remove("key-anim");
    }
  }


  getEncrypted(input, key) {
    // Convert a-z to numbers 0-25 for both input and key
    let inputarr = new Array();
    for (let i = 0; i < input.length; i++) {
      inputarr[i] = input.charCodeAt(i) - 97;
    }
    
    key = key.toLowerCase();
    let mat11 = key.charCodeAt(0) - 97;
    let mat12 = key.charCodeAt(1) - 97;
    let mat21 = key.charCodeAt(2) - 97;
    let mat22 = key.charCodeAt(3) - 97;

    // If odd string length, add an "a" at the end
    if (inputarr.length % 2 == 1) {
      inputarr.push(0);
    }

    // Compute matrix product
    let outstr = "";
    let invec1 = new Array();
    let invec2 = new Array();
    for (let i = 0; i < inputarr.length; i += 2) {
      invec1.push(inputarr[i]);
      invec2.push(inputarr[i + 1]);
    }

    for (let i = 0; i < invec1.length; i++) {
      let outvec = this.matrixOp(invec1[i], invec2[i], mat11, mat12, mat21, mat22);
      // Convert 0-25 back to a-z
      outstr += String.fromCharCode(this.getMod(outvec[0]) + 97);
      outstr += String.fromCharCode(this.getMod(outvec[1]) + 97);
    }

    return outstr;
  }

  getMod(innum) {
    return (innum % 26 + 26) % 26;
  }

  matrixOp(invec1, invec2, mat11, mat12, mat21, mat22) {
    return new Array(mat11 * invec1 + mat12 * invec2, mat21 * invec1 + mat22 * invec2);
  }

}
