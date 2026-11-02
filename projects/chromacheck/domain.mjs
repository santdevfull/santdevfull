export function rgb(hex){if(!/^#[0-9a-f]{6}$/i.test(hex))throw Error("Hex invalido");return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16))}
export function luminance(hex){const c=rgb(hex).map(n=>{const x=n/255;return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
export function contrast(a,b){const [l1,l2]=[luminance(a),luminance(b)].sort((x,y)=>y-x);return(l1+.05)/(l2+.05)}
export function wcag(r){return{aaText:r>=4.5,aaaText:r>=7,aaLarge:r>=3}}
export function suggestText(bg){return contrast(bg,"#000000")>=contrast(bg,"#ffffff")?"#000000":"#ffffff"}
