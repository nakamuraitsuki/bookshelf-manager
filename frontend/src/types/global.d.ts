/*TypeScriptにCSSモジュールを読み取らせるためのやつ*/
declare module '*.module.css'{
    const classes: { [key: string]: string };
    export default classes;
}