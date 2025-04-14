<html>
    <head>
        <meta charset="UTF-8" />
        <title>구구단</title>
        <script crossorigin src="http://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="http://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="http://unpkg.com/babel-standalone@6/babel.min.js"></script>
    </head>
    <body>
        <div id="root"></div>
        <script type="text/babel">
            class GuGuDan extends React.Component{
                constructor(props) {
                    
                    this.state ={
                        first:Mate.ceil(Math.random()*9),
                        second:Mate.ceil(Math.random()*9),
                        value:'',
                        result:'',                        
                    };
                };
            render(){
                return (
                    <div>
                        <div>{this.state.first}곱하기{this.state.second}는?</div>
                        <form>
                            <input type="number" value={this.state.value} onChange={this.setState({value: e.target.value})}/>
                            <button>입력!</button>
                        </form>
                        <div>{this.state.result}</div>
                    </div>
                );
                    //JSX(js+xml)
            }
            }
        </script>
         <script type="text/babel">
            ReactDom.render(<GuGuDan/>, document.querySelector('#root'));
         </script>
    </body>
</html>
