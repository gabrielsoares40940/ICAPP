import { useEffect, useState } from "react";
import { View, Text } from "react-native-animatable";
import { getDocs, collection } from "firebase/firestore";
import { Alert, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { styles } from "./css/css";
import { Card } from "react-native-elements";
import { FIRESTORE_DB } from "@/firebaseConfig";
import * as Animatable from 'react-native-animatable';
import { Feather } from "@expo/vector-icons";

export default function Historico() {
    const [agendamentosData, setAgendamentos] = useState([])
    async function fetchAgendamentos() {
        try {
            const querySnapshot = await getDocs(collection(FIRESTORE_DB, "123"));
            const agendamentosData = querySnapshot.docs.map(doc => (
                {
                    id: doc.id,
                    ...doc.data()
                }
            ));
            setAgendamentos(agendamentosData as never);
        } catch (error) {
            console.error("Erro ao buscar escalas: ", error);
        }
    }

    useEffect(() => {
        fetchAgendamentos()
    }, [])

    function getCardColor(compareceu){
        return compareceu === "presente" ? "green" : "red";
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titleAgendamento2}>Histórico</Text>
            <Text style={styles.PuxeAtualizar}>Arraste para atualizar</Text>
            <FlatList style={{marginBottom:50}}
                refreshControl={<RefreshControl
                    refreshing={false}
                    onRefresh={() => fetchAgendamentos()}
                />}
                data={agendamentosData.filter(item => item.hasOwnProperty('compareceu'))}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Animatable.View delay={50} animation="fadeInUp">
                        <Card containerStyle={{ width: 350, height: 200, borderRadius: 20 }}>
                            <Card.Title>Escala</Card.Title>
                            <Card.Divider color="white">
                                <Text style={{ color:'black', textAlign: "center" }}>Nome: {item.nome}</Text>
                                <Text style={{ color:'black', textAlign: "center" }}>Dia: {item.dia}</Text>
                                <Text style={{ color:'black', textAlign: "center", paddingBottom: 10 }}>Hora: {item.hora}</Text>
                                <Text style={{ color:getCardColor(item.compareceu), textAlign: "center", paddingBottom: 10 }} >{item.compareceu}</Text>
                            </Card.Divider>
                            {item.compareceu=='presente' ? (
                                <Feather name="check" color={'green'} size={15}/>

                            ) : (
                                <Feather name="x" color={'red'} size={15}/>
                            )}
                        </Card>
                    </Animatable.View>
                )}
            />
        </View>

    )
}