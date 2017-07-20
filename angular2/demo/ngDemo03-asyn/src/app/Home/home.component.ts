import {Component} from '@angular/core';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = '新建一个路由该注意什么';
  content= `
     <pre>
      import {Component} from '@angular/core'; 

      @Component({
        selector: 'home',                      //修改
        templateUrl: './home.component.html', //修改
        styleUrls: ['./home.component.css']    //修改
      })
      export class HomeComponent {             //修改
        title1 = 'Hello ng2';
      }
  </pre>

  <h4>Home目录下要有 index.ts</h4>
  <pre>
      export * from './home.component';
  </pre>

    <h4>在app.module.ts增加</h4>
    <pre>
      import {RouterModule} from "@angular/router";
      import {rootRouterConfig} from "./app.routes";   //看情况修改

      import { AppComponent } from './app.component'; 
      import { HomeComponent } from './Home';        //修改  , 与home.component.ts类名相同

      @NgModule({
        declarations: [
          AppComponent,
          HomeComponent                              //修改
        ],
        imports: [
          BrowserModule,
          FormsModule,
          HttpModule,
          RouterModule.forRoot(rootRouterConfig)     //看情况修改
        ],
        providers: [],
        bootstrap: [AppComponent]
      })
    </pre>


    <h4>在app.routes.ts增加</h4>
    <pre>
      import { HomeComponent } from './Home';   //看情况修改

        {
          path: 'home',
          component: HomeComponent
        },
    </pre>
  `

}
