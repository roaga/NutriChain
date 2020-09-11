import {StyleSheet} from 'react-native'

export default styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    greeting: {
        marginTop: 96,
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center"
    },
    errorMessage: {
        height: 72,
        alignItems: 'center',
        justifyContent: "center",
        marginHorizontal: 32
    },
    error: {
        color: "#E9446A",
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center"
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 32
    },
    inputTitle: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "600"
    },
    input: {
        backgroundColor: "#fff",
        height: 64,
        fontSize: 16,
        fontWeight: "600",
        color: "#161F3D",
        borderRadius: 10,
        shadowOpacity: 0.1,
        paddingHorizontal: 16,
        marginTop: 8
    },
    button: {
        marginHorizontal: 80,
        backgroundColor: "#E9446A",
        borderRadius: 10,
        height: 64,
        shadowOpacity: 0.1,
        alignItems: "center",
        justifyContent: "center",        
    },
})

export const colors = {
    primary: "#E9446A"
}