<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{

    /**
     * L'encodeur des mots de passes
     *
     * @var UserPasswordEncoder
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        // Instance de l'objet Factory stocké dans la variable 'faker'
        $faker = Factory::create('fr_FR');

        // Création de 5 utilisateurs reliés à des clients eux-mêmes reliés à des factures
        for($u = 0; $u < 5; $u++){

            // Déclaration du chrono (correspond au numéro de la facture)
            $chrono = 1;
            
            // Création d'une instance de la classe User
            $user = new User;

            // Création du hash de mot de passe grace à l'encoder fourni par injection de dépendance lors de la création de la class AppFixtures
            $hash = $this->encoder->encodePassword($user, 'password');

            // Attribution à cette classe de propriétés aléatoires mais pertinantes
            $user->setFirstName($faker->firstName())
                 ->setLastName($faker->lastName())
                 ->setEmail($faker->email())
                 ->setPassword($hash);
            
            // Faire persister le User au sein de la base de donnée grace au manager
            $manager->persist($user);

            // Création de 30 clients en utilisant une boucle for
            for($c = 0; $c < mt_rand(5,10); $c++){

                // Création d'une instance de la classe Customer
                $customer = new Customer;

                // Attribution à cette classe de propriétés aléatoires mais pertinantes
                $customer->setFirstName($faker->firstName())
                        ->setLastName($faker->lastName())
                        ->setCompany($faker->company())
                        ->setEmail($faker->email())
                        ->setUser($user);
                
                // Faire persister ce client dans la base de données en utilisant le manager
                $manager->persist($customer);

                // Création de factures qui seront associées à ce client
                for($i = 0; $i < mt_rand(2,6); $i++){

                    // Création d'une instance de la class Invoice
                    $invoice = new Invoice;
                    
                    // Attribution à cette classe de propriétés aléatoires mais pertinantes
                    $invoice->setAmount($faker->randomFloat(2,250,5000))
                            ->setSentAt($faker->dateTimeBetween('-6 monts'))
                            ->setStatus($faker->randomElement(['SENT','PAID','CANCELLED']))
                            ->setCustomer($customer)
                            ->setChrono($chrono);
                    
                    // Incrémentation du chrono à chaque nouvelle facture
                    $chrono++;

                    // Faire persister cette facture dans la base de données en utilisant le manager
                    $manager->persist($invoice);
                }            
            }
        }

        $manager->flush();
    }
}
