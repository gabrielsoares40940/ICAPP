import {StyleSheet} from 'react-native';
import { color } from 'react-native-elements/dist/helpers';


export const styles = StyleSheet.create({
    //ESTILIZAÇÃO DAS PAGINAS DE LOGIN E CADASTRO
    container:{
        flex:1,
        backgroundColor:'#63c2d1',    
        justifyContent:'center',
        alignItems:'center',
    },
    container2:{
        justifyContent:'center',
        alignItems:'center',
    },
    texto:{
        color:'#fff',
    },
    img:{
        width:350,
        height:350,
    },
    imgMenor:{
        width:200,
        height:200,
    },
    titleEmailSenha:{
        fontSize:20,
        marginTop:15,
        color:'#fff',
        textAlign:'center',
    },
    title:{
        fontSize:20,
        margin:15,
        alignItems:'center',
    },
    titleApp: {
        fontSize:40,
        color:'#fff',
        fontWeight: 'bold',
        fontFamily:'SpaceMono'
    },
    titleApp2:{
        fontSize:20,
        marginBottom:20,
        color:'#fff',
        fontFamily:'SpaceMono'
    },
    titleAgendamento:{
        fontSize:30,
        margin:30,
        color:'#fff',
        alignItems:'center',
        justifyContent:'center',
        marginTop:50,
    },
    input:{
        fontSize:16,
        margin:10,
        borderWidth:1,
        borderColor:'#fff',
        padding:10,
        width:300,
        borderRadius:20,
        backgroundColor: '#fff',
    },
    button:{
        fontSize:16,
        backgroundColor: '#fff' ,
        padding:10,
        margin: 10,
        marginBottom: 30,
        borderWidth:1,
        borderRadius:20,
        borderColor:'#fff',
        alignItems:'center',
        width:150,
    },
    inputArea:{
        flexDirection:'row',
        fontSize:16,
        margin:10,
        padding:10,
        width:300,
        borderRadius:20,
        backgroundColor:'#fff',
    },
    input2:{
        fontSize:16,
        width:'85%',
        
        
    },
    icon:{
        width:'15%',
        justifyContent:'center',
        alignItems:'center',
    },
    buttonDate:{
        backgroundColor: '#fff' ,
        padding:10,
        margin: 10,
        borderWidth:1,
        borderRadius:20,
        borderColor:'#fff',
        right: 83,
    },
    buttonTime:{
        backgroundColor: '#fff' ,
        padding:10,
        margin: 10,
        borderWidth:1,
        borderRadius:20,
        borderColor:'#fff',
        left: 83,
    },
    //ESTILIZAÇÃO DAS PAGINAS POS LOGADO

    /*Estilização das páginas de criação de agendamento*/
    TextInput:{
        fontSize:16,
        margin:10,
        borderWidth:1,
        borderColor:'#fff',
        padding:10,
        width:500,
        borderRadius:20,
    },
    botaoExcluir:{
        alignItems:'center',
        backgroundColor:"#ec5353",
        borderRadius:20,
        margin:5,
        padding:10,
        width:150,
    },
    botaoCompareceu:{
        alignItems:'center',
        backgroundColor:"#63c2d1",
        borderRadius:20,
        margin:5,
        padding:10,
        width:150,
        
    },
    TextoExcluir:{
        color:"#fff",
        
    },
    TextoCompareceu:{
        color:"#fff",
    },
    teste:{
        borderRadius:20,
    },
    botaoLogoff:{
        fontSize:16,
        backgroundColor:'#fff',
        padding:10,
        margin: 10,
        marginBottom: 30,
        borderWidth:1,
        borderRadius:20,
        borderColor:'#fff',
        alignItems:'center',
        width:100,
    },
    bold:{
        fontWeight:"bold",
    },
})

