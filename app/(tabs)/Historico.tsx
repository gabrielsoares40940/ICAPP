import { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, RefreshControl } from "react-native";
import { getDocs, collection } from "firebase/firestore";
import { Card } from "react-native-elements";
import { FIRESTORE_DB } from "@/firebaseConfig";
import * as Animatable from 'react-native-animatable';
import { Feather } from "@expo/vector-icons";
import { styles } from "./css/css";

interface Agendamento {
    id: string;
    nome: string;
    dia: string;
    hora: string;
    compareceu: string;
}

export default function Historico({ navigation }: { navigation: any }) {
    const [agendamentosData, setAgendamentos] = useState<Agendamento[]>([]);
    const [filterText, setFilterText] = useState<string>('');

    async function fetchAgendamentos() {
        try {
            const querySnapshot = await getDocs(collection(FIRESTORE_DB, "123"));
            const agendamentosData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Agendamento[];
            setAgendamentos(agendamentosData);
        } catch (error) {
            console.error("Erro!", "Erro ao buscar escalas: ", error);
        }
    }

    useEffect(() => {
        fetchAgendamentos();
    }, []);

    function getCardColor(compareceu: string) {
        return compareceu === "Presente" ? "green" : "red";
    }

    const filteredAgendamentos = agendamentosData.filter(item =>
        item.hasOwnProperty('compareceu') && 
        (item.nome.toLowerCase().includes(filterText.toLowerCase()) || 
        item.dia.includes(filterText))
    );


    return (
        <View style={styles.container}>
            <Text style={styles.titleAgendamento2}>Histórico</Text>
            <TextInput
                style={styles.input}
                placeholder="Pesquisar nome ou data"
                placeholderTextColor='#fff'
                value={filterText}
                onChangeText={setFilterText}
            />
            <Text style={styles.PuxeAtualizar}>Arraste para atualizar</Text>
            <FlatList
                style={{ marginBottom: 50 }}
                refreshControl={<RefreshControl
                    refreshing={false}
                    onRefresh={fetchAgendamentos}
                />}
                data={filteredAgendamentos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Animatable.View delay={50} animation="fadeInUp">
                        <Card containerStyle={{ width: 350, height: 210, borderRadius: 20 }}>
                            <Card.Title style={{fontSize:20}}>Escala</Card.Title>
                            {item.compareceu === 'Presente' ? (
                                <Feather name="check" color={'green'} size={20} style={{ left: 300, top: -35 }} />
                            ) : (
                                <Feather name="x" color={'red'} size={20} style={{ left: 300, top: -35 }} />
                            )}
                            <Card.Divider />
                            <Text style={{ color: 'black', textAlign: "center" }}>Nome: {item.nome}</Text>
                            <Text style={{ color: 'black', textAlign: "center" }}>Dia: {item.dia}</Text>
                            <Text style={{ color: 'black', textAlign: "center", paddingBottom: 10 }}>Hora: {item.hora}</Text>
                            <Card.Divider />
                            <Text style={{ color: getCardColor(item.compareceu), textAlign: "center", paddingBottom: 10 }} >
                                {item.compareceu}
                            </Text>
                        </Card>
                    </Animatable.View>
                )}
            />
        </View>
    );
}
