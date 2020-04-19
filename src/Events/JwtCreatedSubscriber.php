<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber{

    public function updateJwtData(JWTCreatedEvent $event){
        // Take the user
        $user = $event->getUser();

        // Enrich the data with User first_name and User last_name
        $data = $event->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);

    }
}