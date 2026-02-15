import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 12 },
    header: { textAlign: 'center', marginBottom: 20 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#003366' }, // Babcock Navy
    subtitle: { fontSize: 12, marginTop: 5 },
    section: { margin: 10, padding: 10, borderBottom: '1px solid #eee' },
    label: { fontWeight: 'bold', marginBottom: 5 },
    row: { marginBottom: 3 },
    footer: { marginTop: 50, textAlign: 'center', fontSize: 10, color: 'gray' }
});

const ReceiptDocument = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>BABCOCK UNIVERSITY HALL ALLOCATION</Text>
                <Text style={styles.subtitle}>Official E-Receipt</Text>
                <Text style={styles.subtitle}>Receipt No: {data.receipt_no}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Student Information</Text>
                <Text style={styles.row}>Name: {data.full_name}</Text>
                <Text style={styles.row}>Matric No: {data.matric_no}</Text>
                <Text style={styles.row}>Department: {data.department}</Text>
                <Text style={styles.row}>Level: {data.level}</Text>
                <Text style={styles.row}>Email: {data.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Allocation Details</Text>
                <Text style={styles.row}>Hall: {data.hall_name}</Text>
                <Text style={styles.row}>Room Number: {data.room_number}</Text>
                <Text style={styles.row}>Allocation Date: {new Date(data.allocation_date).toLocaleDateString()}</Text>
                <Text style={styles.row}>Status: {data.status}</Text>
                <Text style={styles.row}>Transaction Reference: {data.transaction_reference}</Text>
                <Text style={styles.row}>Amount Paid: {data.amount_paid}</Text>
            </View>

            <Text style={styles.footer}>
                Generated on {new Date().toLocaleDateString()}. This is a computer-generated document.
            </Text>
        </Page>
    </Document>
);

export default ReceiptDocument;