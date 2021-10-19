#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float makePoint(float x,float y,float speedx,float speedy,float amplitudx,float amplitudy,float t){
    float xx=x+sin(t*speedx)*amplitudx;
    float yy=y+cos(t*speedy)*amplitudy;
    return 1.0/sqrt(xx*xx+yy*yy);
 } 

void main(){
    
    vec2 p = (gl_FragCoord.xy/u_resolution.x)*2.0-vec2(1.0,u_resolution.y/u_resolution.x);
    
    p=p*2.0;
    vec4 gray = vec4(0.95, 0.95, 0.95, 1.);
    vec3 rojo = vec3(1.000,0.01176,0.3058);
    rojo = 0.95-rojo;
    vec3 verde = vec3(0.7843, 1., 0.);
    verde = 0.95-verde;
    vec3 cel = vec3(0, 1, 0.9843);
    cel = 0.95-cel;
   
    float x=p.x;
   float y=p.y;
    
    float time = u_time;

   float a=
       makePoint(x,y,0.03,0.09,1.7,1.3,time+200.);
   a=a+makePoint(x,y,0.09,0.02,1.,1.,time);
   a=a+makePoint(x,y,0.08,0.07,1.4,1.5,time+200.+200.);
   a=a+makePoint(x,y,0.03,0.08,1.7,1.5,time+900.+200.);
   a=a+makePoint(x,y,0.11,0.1,1.,1.9,time+300.);

   float b=
       makePoint(x,y,0.02,0.09,1.3,1.3,time+200.);
   b=b+makePoint(x,y,0.07,0.07,1.4,1.4,time);
   b=b+makePoint(x,y,0.14,0.06,1.4,1.5,time+200.+200.);
   b=b+makePoint(x,y,0.03,0.08,1.7,1.5,time+900.+200.);
   b=b+makePoint(x,y,0.11,0.1,1.,1.9,time+300.);
   

   float c=
       makePoint(x,y,0.07,0.03,1.3,1.3,time+200.);
   c=c+makePoint(x,y,0.09,0.03,1.4,1.4,time);
   c=c+makePoint(x,y,0.08,0.09,1.4,1.5,time+200.+200.);
   c=c+makePoint(x,y,0.03,0.08,1.7,1.5,time+900.+200.);
   c=c+makePoint(x,y,0.11,0.1,1.,1.9,time+300.);
    
    float total = a+b+c;
    float t1 = a+b;
    float t2 = a+c;
    float t3 = b+c;
    //total = 1.0;
    float size = 25.00;
    
    float componentX = float((a*rojo.x)/t3 + verde.x*b/t2 + cel.x*c/t1)/size;
    float componentY = float(rojo.y*a/t3 + verde.y*b/t2 + cel.y*c/t1)/size;
    float componentZ = float(rojo.z*a/t3 + verde.z*b/t2 + cel.z*c/t1)/size;

    //float componentX = float(a*rojo.x + verde.x*b + cel.x*c)/total/size;
    //float componentY = float(rojo.y*a + verde.y*b + cel.y*c)/total/size;
    //float componentZ = float(rojo.z*a + verde.z*b + cel.z*c)/total/size;
    
       vec4 col = gray - vec4(componentX,componentY,componentZ,0.001);

    gl_FragColor = col;
}			