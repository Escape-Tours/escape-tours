import { Html, Body, Container, Text, Heading, Section, Button } from '@react-email/components';
import * as React from 'react';

export default function HotelEmail({ firstName, lastName, climbDate, numberOfClimbers, routeName, routePrice }: any) {
  return (
    <Html>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f6f9fc', padding: '20px' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px' }}>
          <Heading style={{ color: '#1a365d' }}>Hotel Reservation Confirmed</Heading>
          <Text>We have received your reservation request for <strong>{routeName}</strong>.</Text>
          <Section style={{ backgroundColor: '#f7fafc', padding: '20px', borderRadius: '8px' }}>
            <Text><strong>Guest:</strong> {firstName} {lastName}</Text>
            <Text><strong>Check-in:</strong> {climbDate}</Text>
            <Text><strong>Details:</strong> {numberOfClimbers}</Text>
            <Text><strong>Total Price:</strong> ${routePrice}</Text>
          </Section>
          <Button href="https://escapetourstz.com/admin/bookings" style={{ background: '#1a365d', color: '#fff', padding: '12px', borderRadius: '6px' }}>
            Review in Portal
          </Button>
        </Container>
      </Body>
    </Html>
  );
}