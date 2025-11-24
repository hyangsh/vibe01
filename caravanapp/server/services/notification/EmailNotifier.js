class EmailNotifier {
  update(reservation) {
    console.log(
      `Sending email notification for reservation ${reservation._id}`,
    );
    // In a real app, you would send an email here
  }
}

module.exports = EmailNotifier;
