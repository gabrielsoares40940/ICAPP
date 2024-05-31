import { useEffect, useState } from "react";
import { View, Text } from "react-native-animatable";
import { getDocs, collection } from "firebase/firestore";
import { Alert, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { styles } from "./css/css";
import { Card } from "react-native-elements";
import { FIRESTORE_DB } from "@/firebaseConfig";
import * as Animatable from 'react-native-animatable';

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

    return (
        <View style={styles.container}>
            <Text style={styles.titleAgendamento}>Histórico</Text>
            <Text style={styles.PuxeAtualizar}>Arraste para atualizar</Text>
            <FlatList
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
                            <Card.Divider>
                                <Text style={{ fontWeight: "bold", textAlign: "center" }}>Nome: {item.nome} {console.log(item)}</Text>
                                <Text style={{ fontWeight: "bold", textAlign: "center" }}>Dia: {item.dia}</Text>
                                <Text style={{ fontWeight: "bold", textAlign: "center", paddingBottom: 10 }}>Hora: {item.hora}</Text>
                                <Text style={{ fontWeight: "bold", textAlign: "center", paddingBottom: 10 }}>{item.compareceu}</Text>
                            </Card.Divider>
                        </Card>
                    </Animatable.View>
                )}
            />
        </View>

    )
}
