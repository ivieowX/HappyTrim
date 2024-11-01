import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#288BFF",
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        fontWeight: "bold",
        fontSize: 50,
        color: "black",
        marginBottom: 40,
    },
    inputViewLogin: {
        width: "80%",
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 10,
        color: "black",
    },
    inputView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20,
    },
    inputTextLogin: {
        height: 50,
        color: "black",
        marginBottom: 10,
        backgroundColor: null,
    },
    inputText: {
        height: 50,
        color: "black",
    },
    loginBtn: {
        width: "80%",
        backgroundColor: "black",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    loginText: {
        fontWeight: "bold",
        color: "white",
        fontSize: 22,
    },
    lineStyle: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        alignItems: 'center',
    },
    signGoogleBtn: {
        width: "70%",
        height: 50,
        backgroundColor: "white",
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
    },
    signGooText: {
        color: "black",
        fontWeight: "bold",
    },
    logoRegister: {
        fontWeight: "bold",
        fontSize: 50,
        color: "black",
        marginBottom: 10,
    },
    registerText: {
        fontWeight: "bold",
        color: "black",
        marginTop: 10,
        fontSize: 20,
        textDecorationLine: "underline",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flexDirection: "row",
        backgroundColor: "#FF7F50",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 10,
        margin: 10
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    line: {
        flexDirection: "column",
        alignItems: "center",
        borderTopRadius: 5,
        padding: 10,
        width: "80%",
        borderTopWidth: 10,
        borderTopColor: "black",
      },
});
export default styles;
