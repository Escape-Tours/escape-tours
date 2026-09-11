import { Html, Body, Container, Text, Heading, Section, Hr, Button } from '@react-email/components';
import * as React from 'react';

export default function SafariEmail({ firstName, lastName, climbDate, numberOfClimbers, routeName, routePrice }: any) {
  return (
    <Html>
      <Body style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f0fdf4', padding: '20px' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px', border: '1px solid #dcfce7' }}>
          <Heading style={{ color: '#166534', fontSize: '24px' }}>Safari Adventure Booked!</Heading>
          <Text>Your journey through the wild is being prepared: <strong>{routeName}</strong>.</Text>
          
          <Section style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <Text style={{ margin: '0 0 10px', fontSize: '16px' }}><strong>Lead Traveler:</strong> {firstName} {lastName}</Text>
            <Text style={{ margin: '0 0 10px', fontSize: '16px' }}><strong>Departure Date:</strong> {climbDate}</Text>
            <Text style={{ margin: '0 0 10px', fontSize: '16px' }}><strong>Guest Count:</strong> {numberOfClimbers} Guests</Text>
            <Text style={{ margin: '0', fontSize: '16px' }}><strong>Total Package:</strong> ${routePrice}</Text>
          </Section>

          <Button href="https://escapetourstz.com/admin/bookings" style={{ background: '#166534', color: '#fff', padding: '12px 20px', borderRadius: '6px', marginTop: '20px' }}>
            Review Safari Details
          </Button>
        </Container>
      </Body>
    </Html>
  );
}