import { useEffect , useState} from "react";
import { useSearchParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { PaymentService } from "../../services/paymentService";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [payment, setPayment] = useState(null);
  const sessionId = searchParams.get('session_id');
const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!sessionId) {
        setStatus('error');
        return;
      }

      try {
        // Assuming getPaymentBySession returns a Promise
        const response = await PaymentService.getPaymentBySession(sessionId);
        console.log(response.data);
        
        setPayment(response.data);
        setStatus('success');
      } catch (error) {
        console.error("Error fetching payment:", error);
        setStatus('error');
      }
    };

    fetchPaymentDetails();
  }, [sessionId]);

  const styles = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: '#f8fafc',
      padding: '20px',
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      maxWidth: '500px',
      width: '100%',
      textAlign: 'center',
    },
    icon: { fontSize: '4rem', marginBottom: '1rem' },
    amount: { fontSize: '2.5rem', fontWeight: '800', margin: '10px 0', color: '#1e293b' },
    details: {
      textAlign: 'left',
      backgroundColor: '#f1f5f9',
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0',
      fontSize: '0.9rem',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      borderBottom: '1px solid #e2e8f0',
      paddingBottom: '8px',
    },
    button: {
      display: 'inline-block',
      marginTop: '1rem',
      padding: '12px 24px',
      borderRadius: '8px',
      backgroundColor: '#646cff',
      color: 'white',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'background 0.2s',
    }
  };

  if (status === 'loading') {
    return <div style={styles.wrapper}><h2>Verifying Payment...</h2></div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {status === 'success' && payment ? (
          <>
            <div style={styles.icon}>✅</div>
            <h1 style={{ color: '#059669', margin: 0 }}>Payment Received!</h1>
            <p style={{ color: '#64748b' }}>Thank you for your payment.</p>

            <div style={styles.amount}>
              {payment.amount} <span style={{ fontSize: '1rem' }}>{payment.currency}</span>
            </div>

            <div style={styles.details}>
              <div style={styles.row}>
                <span>Invoice ID:</span>
                <strong>{payment.invoice?.invoiceNumber || 'N/A'}</strong>
              </div>
              <div style={styles.row}>
                <span>Method:</span>
                <strong>{payment.paymentMethod}</strong>
              </div>
              <div style={styles.row}>
                <span>Date:</span>
                <strong>{new Date(payment.paidAt).toLocaleString()}</strong>
              </div>
              <div style={{ ...styles.row, border: 'none' }}>
                <span>Transaction Ref:</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {payment.transactionReference?.substring(0, 20)}...
                </span>
              </div>

              <div style={styles.row}>
                <span>Status:</span>
                <strong>{payment.status}</strong>
              </div>
            </div>

            <button onClick={() => navigate(`/invoices/${payment.invoice.invoiceId}`)} style={styles.button}>Invoice Details</button>
          </>
        ) : (
          <>
            <div style={styles.icon}>❌</div>
            <h1>Payment Failed</h1>
            <p>We couldn't verify this transaction. Please contact support if you believe this is an error.</p>
            <Link to="{`/invoices/${payment.invoiceId}`}" style={{ ...styles.button, backgroundColor: '#ef4444' }}>Invoice Details</Link>
          </>
        )}
      </div>
    </div>
  );
};
export default PaymentSuccess;