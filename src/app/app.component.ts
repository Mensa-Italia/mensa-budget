import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export class Conference {
  month?: number;
  rent?: number;
  travel?: number;
  materials?: number;
  notes?:string;
}

export class Fair {
  date?: string;
  name?: string;
  materials?: number;
  travel?: number;
  costs?: number;
  notes?: string;
}

export class Brain {
  province?: string;
  rent?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  server = 'https://script.google.com/macros/s/AKfycbwaMNIAkgv4EcP9IA28E_RRIoR_qjR2oHt9jwqUTJxtUIvx_LYr/exec';
            
  months = [
    {value:'01', name:'Gennaio'},
    {value:'02', name:'Febbraio'},
    {value:'03', name:'Marzo'},
    {value:'04', name:'Aprile'},
    {value:'05', name:'Maggio'},
    {value:'06', name:'Giugno'},
    {value:'07', name:'Luglio'},
    {value:'08', name:'Agosto'},
    {value:'09', name:'Settembre'},
    {value:'10', name:'Ottobre'},
    {value:'11', name:'Novembre'},
    {value:'12', name:'Dicembre'},
  ]


  title = 'mensa-budget';
  m: {confs:Conference[], tests?:number, fairs:Fair[], brain:Brain[], tests_note?:string, mail?:string} = {
    confs: [],    
    fairs:[],
    brain:[],
  }

  regions = {};
  provinces = [];

  active_region:string;
  active_region_name:string;

  mail = '';

  constructor(
    private http:HttpClient,
  ) { }

  ngOnInit(){
    this.active_region = window.document.location.hash.replace('#', '');

    this.http.get('assets/provs.json').subscribe((data:{COD_REG,DEN_REG,DEN_UTS}[])=>{
      this.provinces = data.map(x=>({name:x.DEN_UTS})).sort();
      data.forEach(element => {
        this.regions[element.COD_REG]=element.DEN_REG;
        if(element.COD_REG === this.active_region){
          let nb = new Brain();
          nb.province = element.DEN_UTS;
          this.m.brain.push(nb);
        }
      });
      this.active_region_name = this.regions[this.active_region];
    });

  }

  onAddConf() {
    this.m.confs.push(new Conference());
  }

  onAddFair() {
    this.m.fairs.push(new Fair());
  }

  onAddBrain() {
    this.m.brain.push(new Brain());
  }
  get fairs_total(){
    let ret = 0;
    this.m.fairs.forEach((fair:Fair) => {
      ret+=(fair.materials?fair.materials:0) + (fair.travel?fair.travel:0) + (fair.costs?fair.costs:0);
    });
    return ret;
  }

  
  get confs_total(){
    let ret = 0;
    this.m.confs.forEach((conf:Conference) => {
      ret+=(conf.materials?conf.materials:0) + (conf.travel?conf.travel:0) + (conf.rent?conf.rent:0);
    });
    return ret;
  }

  sendData(){
    if(confirm('Inviare i dati del budget? non sarà possibile modificarli in seguito.')){
      this.m.mail = this.mail;
      this.http.post(this.server, JSON.stringify(this.m)).subscribe(data=>{
        alert('grazie per aver caricato il budget');
      })
    }
  }
}
