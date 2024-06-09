import {StyleSheet} from 'react-native';
import { color } from 'react-native-elements/dist/helpers';


export const styles = StyleSheet.create({
    //ESTILIZAÇÃO DAS PAGINAS DE LOGIN E CADASTRO
    container:{
        flex:1,
        backgroundColor:'#f7f6f1', //#63c2d1    
        justifyContent:'center',
        alignItems:'center',
    },
    container2:{
        justifyContent:'center',
        alignItems:'center',
        
    },
    fundo:{
        backgroundColor:"#63c2d1",
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
    },
    texto:{
        color:'#808080',
    },
    img:{
        width:350,
        height:350,
        
    },
    imgMenor:{
        width:200,
        height:200,
        marginBottom:50,
    },
    titleEmailSenha:{
        fontSize:20,
        marginTop:15,
        color:'#808080',
        textAlign:'center',
    },
    title:{
        fontSize:20,
        margin:15,
        alignItems:'center',
    },
    titleApp: {
        fontSize:40,
        color:'#56A9B6',
        fontWeight: 'bold',
        fontFamily:'SpaceMono'
    },
    titleApp2:{
        fontSize:20,
        marginBottom:20,
        color:'#63c2d1',
        fontFamily:'SpaceMono',
    },
    titleAgendamento:{
        fontSize:30,
        margin:30,
        color:'#56A9B6',
        alignItems:'center',
        justifyContent:'center',
        marginTop:50,
        marginLeft:'27%',
        fontWeight: 'bold',
        fontFamily:'SpaceMono',

    },
    titleAgendamento2:{
        fontSize:30,
        color:'#56A9B6',
        alignItems:'center',
        justifyContent:'center',
        marginTop:50,
        fontWeight: 'bold',
        fontFamily:'SpaceMono',
        
    },
    input:{
        fontSize:16,
        margin:10,
        borderWidth:1,
        borderColor:'#fff',
        padding:10,
        width:300,
        borderRadius:10,
        color:'#fff',
        backgroundColor: '#63c2d1',
    },
    button:{
        fontSize:16,
        backgroundColor: '#56A9B6',
        padding:10,
        margin: 10,
        marginBottom: 30,
        borderWidth:1,
        borderRadius:10,
        borderColor:'#56A9B6',
        alignItems:'center',
    },
    button2:{
        fontSize:16,
        backgroundColor: '#56A9B6' ,
        padding:10,
        margin: 10,
        marginBottom: 30,
        borderWidth:1,
        borderRadius:10,
        borderColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
        marginTop:50,
    },
    button3:{
        fontSize:16,
        backgroundColor: '#56A9B6' ,
        padding:10,
        margin: 10,
        marginBottom: 30,
        borderRadius:10,
        borderColor:'#fff',
        justifyContent:'center',
        marginTop:50,
        width:'50%',
        color:'#fff'
    },
    inputArea:{
        flexDirection:'row',
        fontSize:16,
        margin:10,
        padding:10,
        width:300,
        borderRadius:10,
        backgroundColor:'#63c2d1',
    },
    input2:{
        fontSize:16,
        width:'80%',
        color:'#fff',
    },
    input3:{
        fontSize:16,
        width:'50%',
        color:'#fff',
        alignItems:'center',
        justifyContent:'center'
    },    
    input4:{
        fontSize:16,
        color:'#fff',
        alignItems:'center',
        justifyContent:'center',
        textAlign:'center'
    },
    icon:{
        width:'10%',
        justifyContent:'center',
        alignItems:'center',
    },
    iconLock:{
        paddingTop:1,
        justifyContent:'center',
        alignItems:'center',
        width:'10%',

    },
    buttonDate:{
        backgroundColor: '#fff' ,
        padding:10,
        margin: 10,
        borderWidth:1,
        borderRadius:10,
        borderColor:'#fff',
        right: 83,
    },
    buttonTime:{
        backgroundColor: '#fff' ,
        padding:10,
        margin: 10,
        borderWidth:1,
        borderRadius:10,
        borderColor:'#fff',
        left: 83,
    },
    inputSelect: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30 // to ensure the text is never behind the icon
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
        borderRadius:10,
    },
    botaoExcluir:{
        alignItems:'center',
        backgroundColor:"#ec5353",
        borderRadius:10,
        margin:5,
        padding:10,
        width:'50%',
    },
    botaoCompareceu:{
        alignItems:'center',
        backgroundColor:"#63c2d1",
        borderRadius:10,
        margin:5,
        padding:10,
        width:'50%',
        
    },
    TextoExcluir:{
        color:"#fff",
        
    },
    TextoCompareceu:{
        color:"#fff",
    },
    teste:{
        borderRadius:10,
    },
    botaoLogoff:{
        fontSize:16,
        backgroundColor:'#63c2d1',
        margin: 50,
        marginBottom: 30,
        borderRadius:10,
        borderColor:'#fff',
        width:70, // ajustar
        alignItems:'center',
    },
    bold:{
        fontWeight:"bold",
    },
    AreaCompareceu:{
        flexDirection:'row',
        justifyContent:"center",
        alignItems:'center',
        margin: 10,
    },
    PuxeAtualizar:{
        color:'#63c2d1',
        marginBottom:10,
        fontWeight:"bold",
    },
    Data:{
        width:250,
    },
    datePicker:{
        height:70,
        margin:5,

    },
    pickerButton:{
        padding:15,
    },
    buttonText:{
        fontSize:14,
        fontWeight:"500",
        color:"#fff",
    },
    // Estilização do Tab Icons
    tabIcons: {
        width:60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'red',
        alignItems:'center',
        justifyContent: 'center',
        marginBottom: 20,
        textAlign: 'center',
        textAlignVertical: 'center'
    }
})

