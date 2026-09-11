import { Html, Body, Container, Text, Heading, Section, Hr, Button } from '@react-email/components';
import * as React from 'react';

export default function TrekEmail({ firstName, lastName, climbDate, numberOfClimbers, routeName, routePrice }: any) {
  return (
    <Html>
      <Body style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#fffbeb', padding: '20px' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '40px', border: '1px solid #fef3c7' }}>
          <Heading style={{ color: '#b45309', fontSize: '24px' }}>Mount Kilimanjaro Expedition</Heading>
          <Text>An adventurer is preparing to conquer: <strong>{routeName}</strong>.</Text>
          
          <Section style={{ backgroundColor: '#fffbeb', padding: '20px', borderRadius: '8px', border: '1px solid #fde68a' }}>
            <Text style={{ margin: '0 0 10px', fontSize: '16px' }}><strong>Climber:</strong> {firstName} {lastName}</Text>
            <Text style={{ margin: '0 0 10px', fontSize: '16px' }}><strong>Start Date:</strong> {climbDate}</Text>
            <Text style={{ margin: '0 0 10px', fontSize: '16px' }}><strong>Expedition Size:</strong> {numberOfClimbers} Climbers</Text>
            <Text style={{ margin: '0', fontSize: '16px' }}><strong>Total Expedition Cost:</strong> ${routePrice}</Text>
          </Section>

          <Button href="https://escapetourstz.com/admin/bookings" style={{ background: '#b45309', color: '#fff', padding: '12px 20px', borderRadius: '6px', marginTop: '20px' }}>
            Review Expedition
          </Button>
        </Container>
      </Body>
    </Html>
  );
}