import { X } from 'lucide-react'

interface LegalModalsProps {
  activeDoc: 'mentions' | 'cgv' | 'privacy' | null;
  onClose: () => void;
}

export default function LegalModals({ activeDoc, onClose }: LegalModalsProps) {
  if (!activeDoc) return null;

  const renderContent = () => {
    switch (activeDoc) {
      case 'mentions':
        return (
          <>
            <h2>MENTIONS LÉGALES</h2>
            <div className="legal-section">
              <h3>1. Éditeur du Site</h3>
              <p>
                Le site <strong>Nagasin</strong> (nagasin.fr) est édité par :
                <br />
                <strong>Benoît Baudu (na!)</strong>
                <br />
                Artiste-Auteur / NA! Studio
                <br />
                Adresse de contact : <a href="mailto:contact@nagasin.fr">contact@nagasin.fr</a>
              </p>
            </div>
            <div className="legal-section">
              <h3>2. Hébergement</h3>
              <p>
                Le site est hébergé par :
                <br />
                <strong>OVH SAS</strong>
                <br />
                SAS au capital de 10 174 560 €
                <br />
                RCS Lille Métropole 424 761 419 00045
                <br />
                Code APE 2620Z
                <br />
                N° TVA : FR 22 424 761 419
                <br />
                Siège social : 2 rue Kellermann - 59100 Roubaix - France
              </p>
            </div>
            <div className="legal-section">
              <h3>3. Propriété Intellectuelle</h3>
              <p>
                L'ensemble des œuvres (dessins, illustrations, ouvrages, textes, etc.) présentées sur ce site sont la propriété exclusive de l'artiste <strong>na! (Benoît Baudu)</strong> et sont protégées par le droit d'auteur, conformément aux dispositions du Code de la propriété intellectuelle. Toute reproduction, diffusion ou représentation, totale ou partielle, est strictement interdite sans accord écrit préalable de l'auteur.
              </p>
            </div>
          </>
        );
      case 'cgv':
        return (
          <>
            <h2>CONDITIONS GÉNÉRALES DE VENTE (CGV)</h2>
            <div className="legal-section">
              <h3>1. Objet</h3>
              <p>
                Les présentes Conditions Générales de Vente régissent les relations contractuelles entre l'artiste <strong>Benoît Baudu</strong> et toute personne physique ou morale effectuant un achat sur le site <strong>nagasin.fr</strong>.
              </p>
            </div>
            <div className="legal-section">
              <h3>2. Produits & Personnalisation (Dédicaces)</h3>
              <p>
                Les produits proposés sont des livres, des ouvrages imprimés et des tirages d'art. 
                Certains produits proposent une option de personnalisation (dédicace demandée lors de la commande).
              </p>
            </div>
            <div className="legal-section">
              <h3>3. Tarifs et Paiement</h3>
              <p>
                Les prix affichés sont exprimés en Euros toutes taxes comprises (TTC), hors participation aux frais d'envoi. La facturation s'effectue sans TVA (TVA non applicable, art. 293 B du CGI) ou avec TVA selon le statut fiscal en vigueur au moment de la vente.
                Le paiement est exigible immédiatement et s'effectue de manière sécurisée par carte bancaire via le prestataire de paiement <strong>Stripe</strong>.
              </p>
            </div>
            <div className="legal-section">
              <h3>4. Livraison</h3>
              <p>
                Les expéditions sont effectuées à l'adresse de livraison indiquée par le client lors de sa commande. Les frais de livraison sont calculés et affichés automatiquement dans le panier d'achat. Les délais de livraison sont indicatifs et dépendent des services de transport (Poste / Colissimo).
              </p>
            </div>
            <div className="legal-section">
              <h3>5. Droit de Rétractation et Exceptions</h3>
              <p>
                Conformément à l'article L221-18 du Code de la consommation, le consommateur dispose d'un délai de quatorze (14) jours pour exercer son droit de rétractation pour les produits standards, sans avoir à motiver sa décision. Les frais de retour sont à la charge exclusive du client.
              </p>
              <div className="legal-warning-box">
                <strong>🚨 EXCEPTION MAJEURE POUR LES DÉDICACES (Article L221-28) :</strong>
                <p>
                  Le droit de rétractation ne s'applique pas aux biens confectionnés selon les spécifications du consommateur ou nettement personnalisés. 
                  En conséquence, <strong>tout produit ayant fait l'objet d'une demande de dédicace personnalisée de la part du client lors de la commande ne pourra faire l'objet d'aucun retour, échange, annulation ou remboursement</strong>.
                </p>
              </div>
            </div>
            <div className="legal-section">
              <h3>6. Garanties et Réclamations</h3>
              <p>
                Les produits bénéficient des garanties légales de conformité (art. L217-4 et suivants du Code de la consommation) et des vices cachés (art. 1641 et suivants du Code civil). Pour toute réclamation, contactez-nous à l'adresse suivante : <a href="mailto:contact@nagasin.fr">contact@nagasin.fr</a>.
              </p>
            </div>
          </>
        );
      case 'privacy':
        return (
          <>
            <h2>POLITIQUE DE CONFIDENTIALITÉ (RGPD)</h2>
            <div className="legal-section">
              <h3>1. Collecte des Données</h3>
              <p>
                Dans le cadre de l'utilisation de la boutique, nous collectons les données strictement nécessaires au traitement de vos commandes : 
                nom, prénom, adresse de livraison, adresse email et confirmation d'email.
              </p>
            </div>
            <div className="legal-section">
              <h3>2. Utilisation et Partage des Données</h3>
              <p>
                Vos informations personnelles sont uniquement utilisées pour traiter, fabriquer, expédier vos commandes et vous envoyer des emails de confirmation et de suivi de livraison.
                Ces informations ne sont jamais partagées, vendues ou louées à des tiers à des fins publicitaires. Elles sont uniquement transmises aux sous-traitants nécessaires : 
                <strong>Stripe</strong> pour le paiement en ligne sécurisé, et les transporteurs postaux pour l'expédition.
              </p>
            </div>
            <div className="legal-section">
              <h3>3. Paiement Sécurisé</h3>
              <p>
                Toutes les transactions par carte bancaire sont traitées de manière ultra-sécurisée par <strong>Stripe</strong>. Les coordonnées de votre carte de paiement ne transitent jamais sur nos serveurs et ne sont jamais stockées par nous.
              </p>
            </div>
            <div className="legal-section">
              <h3>4. Vos Droits (RGPD)</h3>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données personnelles. Vous pouvez exercer ces droits à tout moment en envoyant un e-mail à : <a href="mailto:contact@nagasin.fr">contact@nagasin.fr</a>.
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="legal-modal-overlay" onClick={onClose}>
      <div className="legal-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="legal-close-btn" onClick={onClose} aria-label="Fermer">
          <X size={24} />
        </button>
        <div className="legal-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
