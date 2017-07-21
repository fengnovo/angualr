import {Component,Input,OnInit} from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit{
  @Input() loadingOpt
  wrap:any = {'width': '0px','height':'0px'}
  ll
  lr
  constructor(){
    //[r]="52" [z]="4" [c]="#65bbce"   
    // console.log(loadingOpt)
    
  }


  ngOnInit() {
    // console.log(this.loadingOpt)  //需要在ngOnInit之后引用props
    let{ 
        r = 52,
        z = 4,
        c = "#65bbce"
      } = this.loadingOpt
    this.wrap = {'width': r.toString()+'px','height':r.toString()+'px'}
    this.ll = {
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'width': (r-(2*z)).toString() + 'px',
        'height': (r-(2*z)).toString() + 'px',
        'borderWidth': z.toString()+'px ',
        'borderStyle': 'solid',
        'borderColor': c,
        'borderRadius': '50%',        
        'borderLeft': z.toString()+'px solid transparent',
        'borderBottom': z.toString()+'px solid transparent',
        'transform': 'rotate(40deg)',
        'animation': 'animation-circle-left 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
    }
    this.lr = {
        'position': 'absolute',
        'top': 0,
        'right': 0,
        'width': (r-(2*z)).toString() + 'px',
        'height': (r-(2*z)).toString() + 'px',
        'borderWidth': z.toString()+'px ',
        'borderStyle': 'solid',
        'borderColor': c,
        'borderRadius': '50%',        
        'borderRight': z.toString()+'px solid transparent',
        'borderBottom': z.toString()+'px solid transparent',
        'transform': 'rotate(-310deg)',
        'animation': 'animation-circle-right 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
    }
  }
}
