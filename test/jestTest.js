exports.jestElement = (name, age) =>{
    return (<h1> 
        {name? `jest를 테스트하러 오셨나요? ${age}세 ${name}씨` : "jest Test를 하려면 로그인을 하싶쇼"}
        </h1>);
}