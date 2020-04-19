<?php

namespace App\Entity;

use DateTime;
use App\Entity\User;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use DateTimeZone;

/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 * @ApiResource(
 * 
 *      subresourceOperations={
 *    
 *          "api_customers_invoices_get_subresource"={
 * 
 *              "normalization_context"={"groups" = {"invoices_subresource"}}
 *          }
 *      
 *      },
 * 
 *      itemOperations = {"PUT", "DELETE", "GET", "increment"={
 *          "method"="post",
 *          "path"="/invoices/{id}/increment",
 *          "controller"="App\Controller\InvoiceIncrementationController",
 *          "openapi_context"={
 *              "summary"="Increment an invoice",
 *              "description"="Increment the chrono of the invoice selected by the request"
 *          }
 *        }
 *      },
 * 
 *      attributes={
 * 
 *          "pagination_enabled" = true,
 *          "pagination_items_per_page" = 20,
 *          "order" = {"sentAt":"desc"} 
 *  
 *      },
 * 
 *      normalizationContext = {"groups" = {"invoices_read"}},
 *      denormalizationContext = {"disable_type_enforcement" = true}
 * )
 * 
 * @ApiFilter(OrderFilter::class, properties={"amount":"asc","sentAt","customer.id":"asc"})
 * @ORM\HasLifecycleCallbacks()
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read","customers_read","invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read","customers_read","invoices_subresource"})
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit être un numérique !")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read","customers_read","invoices_subresource"})
     * @Assert\Type("\DateTimeInterface", message="La date doit être au format : YYYY-MM-DD")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read","customers_read","invoices_subresource"})
     * @Assert\NotBlank(message="Le statut de la facture est obligatoire")
     * @Assert\Choice(choices={"SENT","PAID","CANCELLED"}, message="Le statut doit être SENT, PAID ou CANCELLED")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="Le client de la facture doit être renseigné")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read","customers_read","invoices_subresource"})
     * @Assert\NotBlank(message="Le chrono doit être renseigné")
     * @Assert\Type(type="integer", message="Le chrono doit être un nombre")
     */
    private $chrono;


    /**
     * @ORM\PrePersist
     *
     * @return void
     */
    public function setEmptyDate(){
        if(empty($sentAt)){
            $this->setSentAt(new \DateTime());
        }
    }
    
    /**
     * Permet de récupérer l'utilisateur relié à une facture sans passer par le customer
     * @Groups({"invoices_read","invoices_subresource"})
     *
     * @return User
     */
    public function getUser(): User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
