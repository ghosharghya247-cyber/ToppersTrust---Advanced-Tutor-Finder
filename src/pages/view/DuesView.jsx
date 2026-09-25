import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  EmptyState,
  LoadingState,
  Notice,
  PageHeading,
} from "../../components/ui/Primitives";
export default function DuesView({
  dueData,
  loading,
  error,
  paymentLoading,
  paymentMessage,
  tutorName,
  onPayClick,
  onBack,
}) {
  const amount = Number(dueData?.amount || 0);
  const hasDues = Number.isFinite(amount) && amount > 0;
  return (
    <div className="page-container">
      <PageHeading
        eyebrow="YOUR ACCOUNT"
        title="Payments & dues."
        description="A clear view of your outstanding balance."
      >
        <button
          className="button button-secondary button-small"
          onClick={onBack}
        >
          <ArrowLeft size={15} /> Back
        </button>
      </PageHeading>
      {loading ? (
        <LoadingState label="Checking your balance…" />
      ) : error ? (
        <Notice error>{error}</Notice>
      ) : (
        <div className="billing-grid">
          <section className="panel">
            <div className="section-heading">
              <h2>{tutorName || "Tutor"}’s account</h2>
              <span className="icon-tile sage">
                <Wallet size={22} />
              </span>
            </div>
            <p className="balance-label">Outstanding balance</p>
            <div className="balance-value">
              <small>৳</small>
              {amount.toLocaleString("en-BD", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <span className="badge">
              {hasDues ? "Payment due" : "All up to date"}
            </span>
            <div className="billing-divider" />
            {hasDues ? (
              <>
                <div className="billing-detail">
                  <span>Due recorded</span>
                  <strong>{dueData?.date || "Not specified"}</strong>
                </div>
                <div className="billing-detail">
                  <span>Currency</span>
                  <strong>BDT · Bangladeshi taka</strong>
                </div>
                <button
                  className="button button-primary button-full"
                  onClick={onPayClick}
                  disabled={paymentLoading}
                >
                  {paymentLoading
                    ? "Opening secure checkout…"
                    : "Pay outstanding dues"}
                  <ArrowUpRight size={17} />
                </button>
              </>
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="You’re all caught up."
                description="There are no outstanding dues on your account. Keep focusing on what you do best: helping learners grow."
              />
            )}
            <Notice
              error={
                !!paymentMessage &&
                !paymentMessage.toLowerCase().includes("success")
              }
            >
              {paymentMessage}
            </Notice>
          </section>
          <section className="panel tip-panel">
            <span className="eyebrow">
              <ShieldCheck size={17} /> PAYMENT INFORMATION
            </span>
            <h3>
              Simple payments.
              <br />
              More peace of mind.
            </h3>
            <p>
              Payments are handled through SSLCommerz. You’ll be redirected to
              checkout to complete your payment.
            </p>
            <div className="billing-divider" />
            <p>
              Current payment integration uses the SSLCommerz sandbox. Do not
              enter real payment details into a test checkout.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
